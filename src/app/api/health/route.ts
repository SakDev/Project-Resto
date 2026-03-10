import { ok } from "@/lib/http/responses";

export async function GET() {
  return ok({
    status: "ok",
    timestamp: new Date().toISOString(),
  });
}