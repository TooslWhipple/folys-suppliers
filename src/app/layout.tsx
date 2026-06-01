import { Providers } from "./providers";
import "./globals.css";

export const metadata = {
  title: "FolySoft - Portal de Proveedores",
  description: "Portal de proveedores Foly",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es" suppressHydrationWarning>
      <body>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
