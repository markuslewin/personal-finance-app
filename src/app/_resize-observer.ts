import { useCallback, useState, useMemo } from "react";

export const useResizeObserver = (
  callback: ResizeObserverCallback,
  options?: ResizeObserverOptions,
) => {
  return useCallback(
    (node: HTMLElement | null) => {
      if (node === null) {
        throw new Error("Expected `HTMLElement`");
      }

      const observer = new ResizeObserver(callback);
      observer.observe(node, options);
      return () => {
        observer.disconnect();
      };
    },
    [callback, options],
  );
};

export const useInlineSize = (
  box: ResizeObserverBoxOptions = "content-box",
) => {
  const [entries, setEntries] = useState<ResizeObserverEntry[]>();
  const ref = useResizeObserver(
    setEntries,
    useMemo(() => {
      return { box };
    }, [box]),
  );
  return {
    ref,
    size: entries?.[0]?.[getPropertyFromBox(box)]?.[0]?.inlineSize,
  };
};

const getPropertyFromBox = (
  box: ResizeObserverBoxOptions,
): "borderBoxSize" | "contentBoxSize" | "devicePixelContentBoxSize" => {
  switch (box) {
    case "border-box":
      return "borderBoxSize";
    case "content-box":
      return "contentBoxSize";
    case "device-pixel-content-box":
      return "devicePixelContentBoxSize";
  }
};
