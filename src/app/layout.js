import localFont from "next/font/local";
import AuthSessionProvider from "@/component/provider/sessionProvider";
import Navbar from "@/component/layout/navbar";
import "./globals.css";

const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
});

const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
});

export const metadata = {
  title: "Task Manager",
  description: "Efficient task management application",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
        suppressHydrationWarning
      >
        <AuthSessionProvider>
          <Navbar />
          <main className="min-h-screen bg-gray-50 pt-4">
            {children}
          </main>
        </AuthSessionProvider>
      </body>
    </html>
  );
}
