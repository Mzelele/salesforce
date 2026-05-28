"use client";

import { XMarkIcon } from "@heroicons/react/24/outline";
import { CartItem } from "lib/sfcc/types";

export function DeleteItemButton({
  item,
  optimisticUpdate,
}: {
  item: CartItem;
  optimisticUpdate: (merchandiseId: string, updateType: "delete") => void;
}) {
  const merchandiseId = item.merchandise.id;

  return (
    <button
      type="button"
      aria-label="Remove cart item"
      className="flex h-[24px] w-[24px] items-center justify-center rounded-full bg-neutral-500"
      onClick={() => optimisticUpdate(merchandiseId, "delete")}
    >
      <XMarkIcon className="mx-[1px] h-4 w-4 text-white dark:text-black" />
    </button>
  );
}
