import clsx from "clsx";
import Price from "./price";

const Label = ({
  title,
  amountMin,
  amountMax,
  currencyCode,
  position = "bottom",
}: {
  title: string;
  amountMin: string;
  amountMax: string;
  currencyCode: string;
  position?: "bottom" | "center";
}) => {
  const isRangePrice = amountMin !== amountMax;
  return (
    <div
      className={clsx(
        "absolute bottom-0 left-0 flex w-full min-w-0 px-2 pb-1.5 @container/label sm:px-3 sm:pb-2",
        {
          "lg:px-20 lg:pb-[35%]": position === "center",
        },
      )}
    >
      <div className="flex min-w-0 items-center rounded-full border bg-white/70 px-1 py-[1px] text-[10px] font-semibold text-black backdrop-blur-md dark:border-neutral-800 dark:bg-black/70 dark:text-white sm:px-1.5 sm:py-[3px] sm:text-xs">
        <h3 className="mr-1 line-clamp-1 min-w-0 grow pl-1.5 leading-none tracking-tight sm:mr-2 sm:pl-2">
          {title}
        </h3>
        <Price
          className="flex-none rounded-full bg-blue-600 px-1.5 py-[2px] text-white sm:px-2 sm:py-1"
          amount={amountMin}
          prefix={isRangePrice ? "From " : ""}
          currencyCode={currencyCode}
        />
      </div>
    </div>
  );
};

export default Label;
