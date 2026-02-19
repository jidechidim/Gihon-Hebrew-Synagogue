"use client";

import { Suspense } from "react";
import RegisterContent from "./RegisterContent";

export default function RegisterPage() {
  return (
    <Suspense
      fallback={
        <main className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
          <p className="text-gray-500 animate-pulse text-lg">Loading...</p>
        </main>
      }
    >
      <RegisterContent />
    </Suspense>
  );
}
