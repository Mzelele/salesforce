export default function Loading() {
  return (
    <div className="mx-auto max-w-screen-2xl px-4">
      <div className="flex flex-col rounded-lg border border-neutral-200 bg-white p-8 dark:border-neutral-800 dark:bg-black md:p-12 lg:flex-row">
        <div className="h-full w-full basis-full lg:basis-4/6">
          <div className="relative aspect-square h-full max-h-[550px] w-full animate-pulse rounded bg-neutral-200 dark:bg-neutral-800" />
        </div>
        <div className="basis-full lg:basis-2/6">
          <div className="mb-6 mt-6 flex flex-col border-b border-neutral-200 pb-6 dark:border-neutral-700 lg:mt-0 lg:px-6">
            <div className="mb-2 h-8 w-3/4 animate-pulse rounded bg-neutral-200 dark:bg-neutral-800" />
            <div className="h-6 w-32 animate-pulse rounded bg-neutral-200 dark:bg-neutral-800" />
          </div>
          <div className="lg:px-6">
            <div className="mb-4 h-4 w-full animate-pulse rounded bg-neutral-200 dark:bg-neutral-800" />
            <div className="mb-4 h-4 w-5/6 animate-pulse rounded bg-neutral-200 dark:bg-neutral-800" />
            <div className="mb-6 h-12 w-full animate-pulse rounded bg-neutral-200 dark:bg-neutral-800" />
          </div>
        </div>
      </div>
    </div>
  );
}
