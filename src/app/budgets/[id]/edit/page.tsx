import { notFound } from "next/navigation";
import { db } from "~/server/db";
import CategoriesCombobox from "~/app/budgets/_components/categories-combobox";
import ThemesCombobox from "~/app/budgets/_components/themes-combobox";

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
      <CategoriesCombobox name="category" defaultValue={budget.category.id} />
      <ThemesCombobox defaultValue={budget.theme.id} />
    </>
    // <div className="grid grid-cols-[minmax(auto,35rem)] justify-center desktop:justify-start">
    //   <Card.Root>
    //     <Card.Heading>Edit Budget</Card.Heading>
    //     <Card.Description>
    //       As your budgets change, feel free to update your spending limits.
    //     </Card.Description>
    //     <ServerForm>
    //       <Form id={budget.id} />
    //     </ServerForm>
    //   </Card.Root>
    // </div>
  );
};

export default EditBudgetPage;
