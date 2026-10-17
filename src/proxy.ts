import { NextRequest, NextResponse } from "next/server";

const allowedMethods = "GET, POST, PUT, PATCH, DELETE, OPTIONS";
const allowedHeaders = "Content-Type, Authorization, X-Requested-With, X-CSRF-Token";

function corsHeaders(origin: string) {
  return {
    "Access-Control-Allow-Origin": origin,
    "Access-Control-Allow-Credentials": "true",
    "Access-Control-Allow-Methods": allowedMethods,
    "Access-Control-Allow-Headers": allowedHeaders,
    "Access-Control-Max-Age": "600",
    Vary: "Origin",
  };
}

export function proxy(request: NextRequest) {
  const origin = request.headers.get("origin");
  const allowedOrigin = process.env.CORS_ORIGIN;

  if (origin && allowedOrigin && origin !== allowedOrigin) {
    return new NextResponse(null, { status: 403 });
  }

  if (request.method === "OPTIONS") {
    return new NextResponse(null, {
      status: 204,
      headers: origin && allowedOrigin ? corsHeaders(origin) : undefined,
    });
  }

  const response = NextResponse.next();
  if (origin && allowedOrigin) {
    for (const [name, value] of Object.entries(corsHeaders(origin))) {
      response.headers.set(name, value);
    }
  }
  return response;
}

export const config = {
  matcher: ["/api/:path*"],
};
