"use client";

import Link from "next/link";
import { useEffect, useRef } from "react";
import { useAppEvent } from "~/app/_components/app-event";
import Button from "~/app/_components/ui/button";

export const AddNewBudget = () => {
  const { appEvent, setAppEvent } = useAppEvent();
  const buttonRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    let id: NodeJS.Timeout;
    if (appEvent?.type === "budgets:focus-add-new-budget") {
      // Wait out `Dialog` cleanup
      id = setTimeout(() => {
        buttonRef.current!.focus();
        setAppEvent(null);
      });
    }
    return () => {
      clearTimeout(id);
    };
  }, [appEvent, setAppEvent]);

  return (
    <Button ref={buttonRef} asChild>
      <Link href={"/budgets/add"}>
        <span aria-hidden="true">+ </span>Add New Budget
      </Link>
    </Button>
  );
};
