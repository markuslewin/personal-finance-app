import { type Metadata } from "next";
import SignupForm from "~/app/(auth)/signup/_components/signup-form";
import { Link } from "~/app/_components/link";

export const metadata: Metadata = {
  title: "Sign up",
};

const SignupPage = async () => {
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
          Log In
        </Link>
      </p>
    </div>
  );
};

export default SignupPage;
