import Link from "next/link";
import LoginForm from "~/app/(auth)/login/_components/login-form";

const LoginPage = () => {
  return (
    <div className="grid gap-400 rounded-xl bg-white px-250 py-300 text-grey-500 tablet:p-400 forced-colors:border-[0.0625rem]">
      <h1 className="text-preset-1 text-grey-900">Log In</h1>
      <LoginForm />
      <p className="text-center">
        Need to create an account?{" "}
        <Link
          className="text-preset-4-bold text-grey-900 underline transition-colors hocus:text-grey-500"
          href={"/signup"}
        >
          Sign Up
        </Link>
      </p>
    </div>
  );
};

export default LoginPage;
