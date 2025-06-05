// import { NextRequest, NextResponse } from "next/server";
// import { createServerClient } from "@supabase/ssr";

// export async function middleware(req: NextRequest) {
//   const res = NextResponse.next();

//   // Create a Supabase client using the updated API
//   const supabase = createServerClient(
//     process.env.SUPABASE_URL || "",
//     process.env.SUPABASE_ANON_KEY || "",
//     {
//       cookies: {
//         // New API uses getAll and setAll
//         getAll: () => {
//           const cookieObj: { [key: string]: string } = {};
//           req.cookies.getAll().forEach((cookie) => {
//             cookieObj[cookie.name] = cookie.value;
//           });
//           return Object.entries(cookieObj).map(([name, value]) => ({
//             name,
//             value,
//           }));
//         },
//         setAll: (cookies) => {
//           cookies.forEach((cookie) => {
//             res.cookies.set({
//               name: cookie.name,
//               value: cookie.value,
//               ...cookie.options,
//             });
//           });
//         },
//       },
//     }
//   );

//   const {
//     data: { session },
//   } = await supabase.auth.getSession();

//   // Protected routes that require authentication
//   if (req.nextUrl.pathname.startsWith("/account") && !session) {
//     const redirectUrl = new URL("/login", req.url);
//     redirectUrl.searchParams.set("redirectedFrom", req.nextUrl.pathname);
//     return NextResponse.redirect(redirectUrl);
//   }

//   // Admin routes - check for admin role
//   if (req.nextUrl.pathname.startsWith("/admin")) {
//     if (!session) {
//       const redirectUrl = new URL("/login", req.url);
//       redirectUrl.searchParams.set("redirectedFrom", req.nextUrl.pathname);
//       return NextResponse.redirect(redirectUrl);
//     }

//     // Check for admin status from user metadata or claims
//     const {
//       data: { user },
//     } = await supabase.auth.getUser();

//     if (!user?.app_metadata?.role || user.app_metadata.role !== "admin") {
//       return NextResponse.redirect(new URL("/", req.url));
//     }
//   }

//   return res;
// }

// export const config = {
//   matcher: ["/account/:path*", "/admin/:path*"],
// };

import { NextRequest } from "next/server";
import { updateSession } from "@/utils/supabase/middleware";

export async function middleware(request: NextRequest) {
  return await updateSession(request);
}

export const config = {
  matcher: ["/account/:path*", "/admin/:path*"],
};
