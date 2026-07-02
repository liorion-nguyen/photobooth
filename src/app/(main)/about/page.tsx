import AboutPage from "@/components/About/AboutPage";
import { buildPageMetadata } from "@/lib/seo";

export const metadata = buildPageMetadata("about");

export default function Page() {
  return <AboutPage />;
}
