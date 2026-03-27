import { NextResponse } from "next/server";

export function middleware(req: { cookies: { get: (arg0: string) => any; }; url: string | URL | undefined; }) {

  const token = req.cookies.get("access_token");

  if (!token) {
    return NextResponse.redirect(new URL("/login", req.url));
  }

  return NextResponse.next();
}



// await fetch("http://localhost:8000/auth/login", {
//   method: "POST",
//   credentials: "include",
//   headers: {
//     "Content-Type": "application/json"
//   },
//   body: JSON.stringify({
//     email,
//     password
//   })
// });