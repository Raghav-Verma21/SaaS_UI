import { type NextRequest, NextResponse } from "next/server";

import { buildBackendUrl } from "@/lib/api/proxy";

const FORWARDED_HEADERS = ["authorization", "content-type", "accept"] as const;

async function proxyRequest(
  request: NextRequest,
  context: { params: Promise<{ path: string[] }> }
) {
  const { path } = await context.params;
  const url = buildBackendUrl(path, request.nextUrl.search);

  const headers = new Headers();
  for (const name of FORWARDED_HEADERS) {
    const value = request.headers.get(name);
    if (value) {
      headers.set(name, value);
    }
  }

  const hasBody = !["GET", "HEAD"].includes(request.method);
  const body = hasBody ? await request.arrayBuffer() : undefined;

  try {
    const response = await fetch(url, {
      method: request.method,
      headers,
      body,
      cache: "no-store",
    });

    const responseText = await response.text();

    return new NextResponse(responseText, {
      status: response.status,
      headers: {
        "Content-Type":
          response.headers.get("content-type") ?? "application/json",
      },
    });
  } catch (error) {
    console.error(`[API proxy] ${request.method} ${url}`, error);

    return NextResponse.json(
      {
        errorList: [
          {
            message:
              "Unable to reach the API server. Check that the backend is running.",
          },
        ],
      },
      { status: 502 }
    );
  }
}

export const GET = proxyRequest;
export const POST = proxyRequest;
export const PUT = proxyRequest;
export const PATCH = proxyRequest;
export const DELETE = proxyRequest;
