const key = "isSidebarOpen";

export const getIsSidebarOpen = (cookies: {
  get: (name: string) => { value: string } | undefined;
}) => {
  const isSidebarOpenCookie = cookies.get(key);

  return isSidebarOpenCookie === undefined
    ? true
    : isSidebarOpenCookie.value === "true";
};

export const setIsSidebarOpen = (
  value: boolean,
  cookies: { set: (name: string, value: string) => void },
) => {
  cookies.set(key, String(value));
};
