import { redirect } from "next/navigation";
import { getSession } from "~/app/_auth";
import SignupForm from "~/app/(auth)/signup/_components/signup-form";
import { db } from "~/server/db";
import Link from "next/link";

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
    <div className="grid gap-400 rounded-xl bg-white px-250 py-300 text-grey-500 tablet:p-400 forced-colors:border-[0.0625rem]">
      <h1 className="text-preset-1 text-grey-900">Sign Up</h1>
      <SignupForm />
      <p className="text-center">
        Already have an account?{" "}
        <Link
          className="text-preset-4-bold text-grey-900 underline transition-colors hocus:text-grey-500"
          href={"/login"}
        >
          Login
        </Link>
      </p>
    </div>
  );
};

export default SignupPage;
