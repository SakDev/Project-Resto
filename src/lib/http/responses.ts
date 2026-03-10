import { NextResponse } from "next/server";

export function ok<T>(data: T, init?: ResponseInit) {
  return NextResponse.json({ success: true, data }, { status: 200, ...init });
}

export function created<T>(data: T, init?: ResponseInit) {
  return NextResponse.json({ success: true, data }, { status: 201, ...init });
}

export function badRequest(message: string, details?: unknown) {
  return NextResponse.json(
    { success: false, error: { code: "bad_request", message, details } },
    { status: 400 },
  );
}

export function serverError(message = "Unexpected server error") {
  return NextResponse.json(
    { success: false, error: { code: "server_error", message } },
    { status: 500 },
  );
}