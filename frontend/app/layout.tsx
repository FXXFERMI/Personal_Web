// Root layout — required by Next.js App Router to anchor the /api route tree.
// Page segments (IBM, [locale]) each render their own full <html> shell.
export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html>
      <body>{children}</body>
    </html>
  );
}
