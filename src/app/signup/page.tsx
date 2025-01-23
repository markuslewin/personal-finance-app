import Link from "next/link";

const SignupPage = () => {
  return (
    <>
      <h1 className="text-preset-1">Sign Up</h1>
      <Link href={"/login"}>Login</Link>
    </>
  );
};

export default SignupPage;
