"use client";

import AuthWrapper from "@/app/components/AuthWrapper";
import { SuperSafeGirlfriend } from "@/app/components/SuperSafeGirlfriend";

export default function Home() {
  return (
    <div className="flex min-h-96 flex-col items-center justify-between p-12">
      <AuthWrapper>
        <SuperSafeGirlfriend />
      </AuthWrapper>
    </div>
  );
}
