import { buildPageMetadata } from "@/lib/seo";

export const metadata = buildPageMetadata("photobooth");

export default function PhotoboothLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
