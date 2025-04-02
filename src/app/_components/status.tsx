import { type ComponentPropsWithRef } from "react";

type StatusProps = ComponentPropsWithRef<"span">;

const Status = (props: StatusProps) => {
  // todo: `aria-live`?
  return <span role="status" {...props} />;
};

export default Status;
