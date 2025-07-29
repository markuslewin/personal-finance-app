"use client";

import { Portal } from "@radix-ui/react-portal";
import { cx } from "class-variance-authority";
import { useId, useMemo } from "react";
import { getPages, MIN_AVAILABLE } from "~/app/(main)/transactions/_pagination";
import { Link } from "~/app/_components/link";
import { useInlineSize } from "~/app/_resize-observer";

type PagesProps = {
  current: number;
  total: number;
};

export const Pages = ({ current, total }: PagesProps) => {
  const pagesId = useId();
  const list = useInlineSize();
  const page = useInlineSize("border-box");
  const gap = useInlineSize("border-box");

  const listSize = list.size ?? 450;
  const pageSize = page.size ?? 40;
  const gapSize = gap.size ?? 8;

  const available = useMemo(() => {
    let available = 0;
    for (
      let spaceLeft = listSize;
      spaceLeft >= pageSize;
      spaceLeft -= pageSize + gapSize
    ) {
      ++available;
    }
    return Math.max(MIN_AVAILABLE, available);
  }, [listSize, pageSize, gapSize]);

  const pages = useMemo(() => {
    return getPages(available, current, total);
  }, [available, current, total]);

  return (
    <>
      <p className="sr-only">
        <span id={pagesId}>Pages</span>:
      </p>
      <ol
        className={cx(
          "flex justify-center gap-100",
          pages.length <= MIN_AVAILABLE ? "flex-wrap" : null,
        )}
        ref={list.ref}
        role="list"
        aria-labelledby={pagesId}
      >
        {pages.map((p, i) => {
          const isCurrent = p === current;
          return (
            <li className="grid" key={i}>
              {typeof p === "number" ? (
                <Link
                  className={cx(
                    "grid size-500 place-items-center rounded-lg border-[0.0625rem] transition-colors",
                    isCurrent
                      ? "border-grey-900 bg-grey-900 text-white"
                      : "border-beige-500 hocus:bg-beige-500 hocus:text-white",
                  )}
                  ref={i === 0 ? page.ref : undefined}
                  // todo: href={`/transactions?${createSearchParams(p)}`}
                  href="#"
                  scroll={false}
                  aria-current={isCurrent ? "page" : undefined}
                >
                  {p}
                </Link>
              ) : (
                <p className="grid size-500 place-items-center rounded-lg border-[0.0625rem] border-beige-500">
                  ...
                </p>
              )}
            </li>
          );
        })}
      </ol>
      <Portal>
        <div className="pointer-events-none size-100" ref={gap.ref} />
      </Portal>
    </>
  );
};
