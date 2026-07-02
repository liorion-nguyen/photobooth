import { buildPageMetadata } from "@/lib/seo";

export const metadata = buildPageMetadata("framesContribute");

export default function ContributeLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
