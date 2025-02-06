"use client";

import { cx } from "class-variance-authority";
import { useId, type ComponentPropsWithRef } from "react";

type SearchResultsSectionProps = ComponentPropsWithRef<"section">;

const SearchResultsSection = ({
  className,
  children,
  ...props
}: SearchResultsSectionProps) => {
  const labelId = useId();

  return (
    <section aria-labelledby={labelId} {...props} className={cx(className, "")}>
      <h2 className="sr-only" id={labelId}>
        Search results
      </h2>
      {children}
    </section>
  );
};

export default SearchResultsSection;
