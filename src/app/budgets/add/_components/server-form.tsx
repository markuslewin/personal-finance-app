import Form from "~/app/budgets/add/_components/client-form";
import { db } from "~/server/db";

const ServerForm = async () => {
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

  return <Form categories={categories} themes={themes} />;
};

export default ServerForm;
