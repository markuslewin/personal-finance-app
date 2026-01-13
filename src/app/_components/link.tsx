// https://github.com/vercel/react-transition-progress/blob/7accf8868e86a50e7276eaa977ab4a3b1630c702/src/next.tsx
"use client";

import BaseLink from "next/link";
import { useRouter } from "next/navigation";
import {
  startTransition,
  type ComponentPropsWithRef,
  type MouseEvent,
} from "react";
import { useProgress } from "~/app/_components/progress";

const isModifiedEvent = (event: MouseEvent): boolean => {
  const eventTarget = event.currentTarget as HTMLAnchorElement | SVGAElement;
  const target = eventTarget.getAttribute("target");
  return (
    // eslint-disable-next-line @typescript-eslint/prefer-nullish-coalescing
    (target && target !== "_self") ||
    event.metaKey ||
    event.ctrlKey ||
    event.shiftKey ||
    event.altKey || // triggers resource download
    // eslint-disable-next-line @typescript-eslint/prefer-optional-chain, @typescript-eslint/no-deprecated
    (event.nativeEvent && event.nativeEvent.which === 2)
  );
};

type LinkProps = Omit<ComponentPropsWithRef<typeof BaseLink>, "href"> & {
  href: string;
};

export const Link = (props: LinkProps) => {
  const router = useRouter();
  const progress = useProgress();

  return (
    <BaseLink
      {...props}
      onClick={(e) => {
        if (isModifiedEvent(e)) {
          return;
        }

        e.preventDefault();
        startTransition(() => {
          progress.start();
          router.push(props.href, { scroll: props.scroll });
        });
      }}
    />
  );
};
