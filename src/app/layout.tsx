import {
  ClerkProvider,
  SignInButton,
  SignedIn,
  SignedOut,
  UserButton,
} from "@clerk/nextjs";
import "./globals.css";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ClerkProvider>
      <html lang="en">
        <body className="bg-gray-100">
          <header className="flex items-center justify-between p-6 bg-white shadow-md">
            <div className="flex items-center space-x-4">
              {/* Add your app logo here */}
              <span className="font-semibold text-xl">My Girlfriend App</span>
            </div>
            <nav className="hidden md:flex space-x-4">
              <SignedOut>
                <SignInButton />
              </SignedOut>
              <SignedIn>
                <UserButton />
              </SignedIn>
            </nav>
          </header>
          <main className="p-6">{children}</main>
        </body>
      </html>
    </ClerkProvider>
  );
}
