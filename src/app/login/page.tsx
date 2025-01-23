import Link from "next/link";

const LoginPage = () => {
  return (
    <>
      <h1 className="text-preset-1">Login</h1>
      <Link href={"/signup"}>Sign Up</Link>
    </>
  );
};

export default LoginPage;
