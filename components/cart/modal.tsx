"use client";

import { Dialog, Transition } from "@headlessui/react";
import Price from "components/price";
import { DEFAULT_OPTION } from "lib/constants";
import { trackInitiateCheckout } from "lib/meta-pixel";
import { createUrl } from "lib/utils";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Fragment, useEffect, useState } from "react";
import { useCart } from "./cart-context";
import { DeleteItemButton } from "./delete-item-button";
import { EditItemQuantityButton } from "./edit-item-quantity-button";
import OpenCart from "./open-cart";

type MerchandiseSearchParams = {
  [key: string]: string;
};

export default function CartModal() {
  const { cart, updateCartItem } = useCart();
  const [isOpen, setIsOpen] = useState(false);
  const openCart = () => setIsOpen(true);
  const closeCart = () => setIsOpen(false);
  const pathname = usePathname();
  const handleCheckout = () => {
    if (cart?.lines.length) {
      trackInitiateCheckout({
        content_ids: cart.lines
          .map((item) => item.merchandise.id || item.merchandise.product.id)
          .filter(Boolean),
        content_type: "product",
        value: Number(cart.cost.totalAmount.amount),
        currency: cart.cost.totalAmount.currencyCode,
        num_items: cart.totalQuantity,
      });
    }

    closeCart();
  };

  useEffect(() => {
    const onItemAdded = () => openCart();
    window.addEventListener("cart:item-added", onItemAdded);
    return () => window.removeEventListener("cart:item-added", onItemAdded);
  }, []);

  useEffect(() => {
    closeCart();
  }, [pathname]);

  useEffect(() => {
    const onUpdate = () => {
      // force re-read from localStorage by dispatching a no-op
      // the cart-context already updates its own state
    };
    window.addEventListener("cart-updated", onUpdate);
    return () => window.removeEventListener("cart-updated", onUpdate);
  }, []);

  return (
    <>
      <button aria-label="Open cart" onClick={openCart}>
        <OpenCart quantity={cart?.totalQuantity} />
      </button>
      <Transition show={isOpen}>
        <Dialog onClose={closeCart} className="relative z-50">
          <Transition.Child
            as={Fragment}
            enter="transition-all ease-in-out duration-300"
            enterFrom="opacity-0 backdrop-blur-none"
            enterTo="opacity-100 backdrop-blur-[.5px]"
            leave="transition-all ease-in-out duration-200"
            leaveFrom="opacity-100 backdrop-blur-[.5px]"
            leaveTo="opacity-0 backdrop-blur-none"
          >
            <div className="fixed inset-0 bg-black/30" aria-hidden="true" />
          </Transition.Child>
          <Transition.Child
            as={Fragment}
            enter="transition-all ease-in-out duration-300"
            enterFrom="translate-x-full"
            enterTo="translate-x-0"
            leave="transition-all ease-in-out duration-200"
            leaveFrom="translate-x-0"
            leaveTo="translate-x-full"
          >
            <Dialog.Panel className="fixed bottom-0 right-0 top-0 flex h-full w-full flex-col border-l border-neutral-200 text-neutral-900 md:w-[390px]" style={{ backgroundColor: "#EEF4F8" }}>
              <div className="flex items-center justify-between px-4 py-4 md:px-6">
                <p className="text-lg font-semibold">My Cart</p>
                <button aria-label="Close cart" onClick={closeCart}>
                  <CloseCart />
                </button>
              </div>

              {!cart || cart.lines.length === 0 ? (
                <div className="mt-20 flex w-full flex-col items-center justify-center overflow-hidden">
                  <svg className="h-16 w-16 text-neutral-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                  </svg>
                  <p className="mt-6 text-center text-2xl font-bold text-neutral-900">
                    Your cart is empty.
                  </p>
                  <Link
                    href="/shop"
                    onClick={closeCart}
                    className="mt-6 rounded-full bg-blue-600 px-6 py-3 text-sm font-semibold text-white transition hover:bg-blue-700"
                  >
                    Continue Shopping
                  </Link>
                </div>
              ) : (
                <div className="flex h-full flex-col justify-between overflow-hidden px-4 pb-4 md:px-6">
                  <div className="grow overflow-auto rounded-xl border border-neutral-200 bg-white shadow-sm">
                    <ul className="divide-y divide-neutral-200">
                    {cart.lines
                      .sort((a, b) =>
                        a.merchandise.product.title.localeCompare(
                          b.merchandise.product.title,
                        ),
                      )
                      .map((item, i) => {
                        const merchandiseSearchParams =
                          {} as MerchandiseSearchParams;

                        item.merchandise.selectedOptions.forEach(
                          ({ name, value }) => {
                            if (value !== DEFAULT_OPTION) {
                              merchandiseSearchParams[name.toLowerCase()] =
                                value;
                            }
                          },
                        );

                        const merchandiseUrl = createUrl(
                          `/product/${item.merchandise.product.handle}`,
                          new URLSearchParams(merchandiseSearchParams),
                        );

                        return (
                          <li
                            key={i}
                            className="flex w-full flex-col"
                          >
                            <div className="relative flex w-full flex-row justify-between px-3 py-4">
                              <div className="absolute z-40 -ml-1 -mt-2">
                                <DeleteItemButton
                                  item={item}
                                  optimisticUpdate={updateCartItem}
                                />
                              </div>
                              <div className="flex min-w-0 flex-1 flex-row">
                                <div className="relative h-16 w-16 flex-none overflow-hidden rounded-md border border-neutral-300 bg-neutral-100">
                                  <Image
                                    className="h-full w-full object-cover"
                                    width={64}
                                    height={64}
                                    alt={
                                      item.merchandise.product.image?.altText ||
                                      item.merchandise.product.featuredImage
                                        ?.altText ||
                                      item.merchandise.product.title
                                    }
                                    src={
                                      item.merchandise.product.image?.url ||
                                      item.merchandise.product.featuredImage
                                        ?.url ||
                                      ""
                                    }
                                  />
                                </div>
                                <Link
                                  href={merchandiseUrl}
                                  onClick={closeCart}
                                  className="z-30 ml-2 flex min-w-0 flex-1 flex-row space-x-4"
                                >
                                  <div className="flex min-w-0 flex-1 flex-col text-base">
                                    <span className="line-clamp-2 leading-tight text-neutral-900">
                                      {item.merchandise.product.title}
                                    </span>
                                    {item.merchandise.title !==
                                    DEFAULT_OPTION ? (
                                      <p className="text-sm text-neutral-600 mt-1">
                                        {item.merchandise.title}
                                      </p>
                                    ) : null}
                                  </div>
                                </Link>
                              </div>
                              <div className="flex h-16 flex-col justify-between">
                                <Price
                                  className="flex justify-end space-y-2 text-right text-sm text-neutral-900"
                                  amount={item.cost.totalAmount.amount}
                                  currencyCode={
                                    item.cost.totalAmount.currencyCode
                                  }
                                />
                                <div className="ml-auto flex h-9 flex-row items-center rounded-full border border-neutral-300 bg-white">
                                  <EditItemQuantityButton
                                    item={item}
                                    type="minus"
                                    optimisticUpdate={updateCartItem}
                                  />
                                  <p className="w-6 text-center">
                                    <span className="w-full text-sm text-neutral-900">
                                      {item.quantity}
                                    </span>
                                  </p>
                                  <EditItemQuantityButton
                                    item={item}
                                    type="plus"
                                    optimisticUpdate={updateCartItem}
                                  />
                                </div>
                              </div>
                            </div>
                          </li>
                        );
                      })}
                    </ul>
                  </div>
                  <div className="mt-4 rounded-xl border border-neutral-200 bg-white p-4 shadow-sm">
                    <div className="flex items-center justify-between">
                      <p className="text-base font-medium text-neutral-900">Total</p>
                      <Price
                        className="text-right text-base font-semibold text-neutral-900"
                        amount={cart.cost.totalAmount.amount}
                        currencyCode={cart.cost.totalAmount.currencyCode}
                      />
                    </div>
                    <Link
                      href="/checkout"
                      onClick={handleCheckout}
                      className="mt-4 block w-full rounded-full bg-blue-600 p-3 text-center text-sm font-semibold text-white transition hover:bg-blue-700"
                    >
                      Proceed to Checkout
                    </Link>
                  </div>
                </div>
              )}
            </Dialog.Panel>
          </Transition.Child>
        </Dialog>
      </Transition>
    </>
  );
}

function CloseCart({ className }: { className?: string }) {
  return (
    <div className="relative flex h-11 w-11 items-center justify-center rounded-md border border-neutral-200 text-neutral-900 transition-colors">
      <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
        <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12 19 6.41z" />
      </svg>
    </div>
  );
}
