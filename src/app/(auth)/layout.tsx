export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen flex items-center justify-center bg-surface relative overflow-hidden px-4 py-10">
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-[-15%] right-[-10%] w-[45%] h-[45%] bg-primary/10 blur-[120px] rounded-full" />
        <div className="absolute bottom-[-15%] left-[-10%] w-[40%] h-[40%] bg-tertiary/10 blur-[100px] rounded-full" />
        <div className="preview-noise-overlay absolute inset-0 opacity-[0.04]" />
      </div>
      <div className="relative w-full max-w-md">{children}</div>
    </div>
  );
}
