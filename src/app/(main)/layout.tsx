import MainLayoutClient from "@/components/Layout/MainLayoutClient";

export default function MainLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <MainLayoutClient>{children}</MainLayoutClient>;
}
