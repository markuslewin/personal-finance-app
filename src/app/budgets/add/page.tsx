import Form from "~/app/budgets/add/_components/form";
import { db } from "~/server/db";

const AddBudgetPage = async () => {
  // todo: "Already used"
  const [categories, themes] = await Promise.all([
    db.category.findMany({
      select: {
        id: true,
        name: true,
      },
    }),
    db.theme.findMany({
      select: {
        id: true,
        name: true,
        color: true,
      },
    }),
  ]);

  return (
    <div className="grid max-w-[35rem] gap-250 rounded-xl bg-white px-250 py-300 text-grey-500 tablet:p-400">
      <h1 className="text-preset-1 text-grey-900">Add New Budget</h1>
      <p>
        Choose a category to set a spending budget. These categories can help
        you monitor spending.
      </p>
      <Form categories={categories} themes={themes} />
    </div>
  );
};

export default AddBudgetPage;
