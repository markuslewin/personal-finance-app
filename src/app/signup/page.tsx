import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import SignupForm from "~/app/signup/_components/signup-form";
import { db } from "~/server/db";

const SignupPage = async () => {
  // todo: Abstraction
  const cookieStore = await cookies();
  const userIdCookie = cookieStore.get("userId");
  if (userIdCookie) {
    const user = await db.user.findUnique({
      select: {
        id: true,
      },
      where: {
        id: userIdCookie.value,
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
