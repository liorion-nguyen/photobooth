import FramesGalleryPage from "@/components/Frames/FramesGalleryPage";
import { buildPageMetadata } from "@/lib/seo";

export const metadata = buildPageMetadata("frames");

export default function Page() {
  return <FramesGalleryPage />;
}
