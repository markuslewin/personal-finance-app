import Link from "next/link";

const BudgetsPage = () => {
  return (
    <>
      <h1 className="text-preset-1">Budgets</h1>
      <p>
        <Link href={"/budgets/add"}>
          <span aria-hidden="true">+ </span>Add New Budget
        </Link>
      </p>
      <p>
        <Link href={"/budgets/edit"}>Edit Budget</Link>
      </p>
    </>
  );
};

export default BudgetsPage;
