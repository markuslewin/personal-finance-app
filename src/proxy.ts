import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

// Next expects encoded paths, but Azure App Service decodes some characters
// Incorrect: `/_next/static/chunks/app/@modal/(.)photos/%5Bid%5D/page-e4ba477351e5f10d.js`
// Correct: `/_next/static/chunks/app/%40modal/(.)photos/%5Bid%5D/page-e4ba477351e5f10d.js`
export const proxy = (request: NextRequest) => {
  return NextResponse.rewrite(request.url.replace("@", "%40"));
};

// export const config = {
//   matcher: "/about/:path*",
// };
