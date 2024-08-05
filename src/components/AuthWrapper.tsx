"use client";

// components/AuthWrapper.tsx
import { SignIn } from "@clerk/nextjs";
import { useAuth } from "@clerk/nextjs";

export default function AuthWrapper({
  children,
}: {
  children: React.ReactNode;
}) {
  const { isLoaded, userId } = useAuth();

  if (!isLoaded) {
    return <div>Loading...</div>;
  }

  if (!userId) {
    return <SignIn />;
  }

  return <>{children}</>;
}
