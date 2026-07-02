import LandingPage from "@/components/Landing/LandingPage";
import JsonLd from "@/components/Seo/JsonLd";
import {
  buildPageMetadata,
  faqJsonLd,
  organizationJsonLd,
  webAppJsonLd,
} from "@/lib/seo";

export const metadata = buildPageMetadata("home");

export default function Page() {
  return (
    <>
      <JsonLd data={[organizationJsonLd, webAppJsonLd, faqJsonLd]} />
      <LandingPage />
    </>
  );
}
