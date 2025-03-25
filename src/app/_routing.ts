import {
  type ReadonlyURLSearchParams,
  usePathname,
  useRouter,
  useSearchParams,
} from "next/navigation";
import { useTransition, useOptimistic, useCallback, useMemo } from "react";

export const useOptimisticSearchParams = () => {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [isPending, startTransition] = useTransition();
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
      });
    },
    [pathname, router, setOptimisticSearchParams],
  );

  return useMemo(
    () => ({
      isPending,
      searchParams: optimisticSearchParams,
      setSearchParams,
    }),
    [isPending, optimisticSearchParams, setSearchParams],
  );
};
