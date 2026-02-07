import { NextRequest, NextResponse } from "next/server";

/**
 * Proxy ảnh từ URL bên ngoài để tránh CORS khi vẽ lên canvas.
 * Chỉ chấp nhận URL ảnh (http/https), không proxy arbitrary URLs.
 */
export async function GET(request: NextRequest) {
  const url = request.nextUrl.searchParams.get("url");
  if (!url || typeof url !== "string") {
    return NextResponse.json({ error: "Missing url" }, { status: 400 });
  }

  let parsed: URL;
  try {
    parsed = new URL(url);
  } catch {
    return NextResponse.json({ error: "Invalid url" }, { status: 400 });
  }
  if (!["http:", "https:"].includes(parsed.protocol)) {
    return NextResponse.json({ error: "Only http(s) allowed" }, { status: 400 });
  }

  try {
    const res = await fetch(url, {
      headers: { "User-Agent": "Photobooth-Image-Proxy/1.0" },
      next: { revalidate: 60 },
    });
    if (!res.ok) {
      return NextResponse.json({ error: "Upstream error" }, { status: 502 });
    }
    const contentType = res.headers.get("content-type") || "image/png";
    if (!contentType.startsWith("image/")) {
      return NextResponse.json({ error: "Not an image" }, { status: 400 });
    }
    const buffer = await res.arrayBuffer();
    return new NextResponse(buffer, {
      headers: {
        "Content-Type": contentType,
        "Cache-Control": "public, max-age=3600",
      },
    });
  } catch (e) {
    console.error("[proxy-image]", e);
    return NextResponse.json({ error: "Proxy failed" }, { status: 502 });
  }
}
