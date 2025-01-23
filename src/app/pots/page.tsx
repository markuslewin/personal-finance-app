import Link from "next/link";

const PotsPage = () => {
  return (
    <>
      <h1 className="text-preset-1">Pots</h1>
      <p>
        <Link href={"/pots/add"}>
          <span aria-hidden="true">+ </span>Add New Pot
        </Link>
      </p>
      <p>
        <Link href={"/pots/edit"}>Edit Pot</Link>
      </p>
      <p>
        <Link href={"/pots/add-money"}>
          <span aria-hidden="true">+ </span>Add Money
        </Link>
      </p>
      <p>
        <Link href={"/pots/withdraw"}>Withdraw</Link>
      </p>
    </>
  );
};

export default PotsPage;
