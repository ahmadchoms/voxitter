import { AuthProvider } from "@/components/auth/auth-provider";
import "./globals.css";
import { Inter } from "next/font/google";
import { Toaster } from "sonner";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "Voxitter - Platform Suara Warga Digital",
  description: "Platform sosial untuk diskusi isu-isu penting masyarakat",
};

export default function RootLayout({
  children,
}) {
  return (
    <html lang="id" suppressHydrationWarning>
      <body className={inter.className}>
        <AuthProvider>
          {children}
          <Toaster richColors />
        </AuthProvider>
      </body>
    </html>
  );
}
