import { notFound } from "next/navigation";
import ServerForm from "~/app/budgets/add/_components/server-form";
import { db } from "~/server/db";

const EditBudgetPage = async ({
  params,
}: {
  params: Promise<{ id: string }>;
}) => {
  const id = (await params).id;
  const budget = await db.budget.findUnique({
    select: {
      id: true,
      maximum: true,
      category: {
        select: {
          id: true,
        },
      },
      theme: {
        select: {
          id: true,
        },
      },
    },
    where: {
      id,
    },
  });
  if (!budget) {
    notFound();
  }

  return (
    <>
      <h1 className="text-preset-1">Edit Budget</h1>
      <ServerForm />
    </>
  );
};

export default EditBudgetPage;
