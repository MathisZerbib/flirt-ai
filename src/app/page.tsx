"use client";

import { SuperGirlfriend } from "@/components/SuperGirlfriend";
import AuthWrapper from "@/components/AuthWrapper";

export default function Home() {
  return (
    <div className="flex min-h-96 flex-col items-center justify-between p-24">
      <AuthWrapper>
        <SuperGirlfriend />
      </AuthWrapper>
    </div>
  );
}
