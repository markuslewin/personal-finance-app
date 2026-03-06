import {
  type ReadonlyURLSearchParams,
  usePathname,
  useRouter,
  useSearchParams,
} from "next/navigation";
import { useTransition, useOptimistic, useCallback, useMemo } from "react";

export const useOptimisticSearchParams = (options?: {
  onDone?: () => void;
}) => {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [pending, startTransition] = useTransition();
  const [optimisticSearchParams, setOptimisticSearchParams] = useOptimistic(
    searchParams,
    (_, values: ReadonlyURLSearchParams) => values,
  );

  const setSearchParams = useCallback(
    (searchParams: ReadonlyURLSearchParams) => {
      startTransition(() => {
        setOptimisticSearchParams(searchParams);

        router.replace(`${pathname}?${searchParams.toString()}`, {
          scroll: false,
        });
        options?.onDone?.();
      });
    },
    [options, pathname, router, setOptimisticSearchParams],
  );

  return useMemo(
    () => ({
      pending,
      searchParams: optimisticSearchParams,
      setSearchParams,
    }),
    [pending, optimisticSearchParams, setSearchParams],
  );
};
