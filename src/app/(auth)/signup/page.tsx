import { redirect } from "next/navigation";
import { getSession } from "~/app/_auth";
import SignupForm from "~/app/(auth)/signup/_components/signup-form";
import { db } from "~/server/db";

const SignupPage = async () => {
  const userId = await getSession();
  if (typeof userId === "string") {
    const user = await db.user.findUnique({
      select: {
        id: true,
      },
      where: {
        id: userId,
      },
    });
    if (user) {
      redirect("/");
    }
  }

  return (
    <>
      <h1 className="text-preset-1">Sign Up</h1>
      <SignupForm />
    </>
  );
};

export default SignupPage;
