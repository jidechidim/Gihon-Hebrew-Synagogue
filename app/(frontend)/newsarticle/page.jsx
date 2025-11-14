"use client";

import { Suspense } from "react";
import NewsArticleContent from "./NewsArticleContent";

export default function NewsArticlePage() {
  return (
    <Suspense fallback={
      <main className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
        <p className="text-gray-500 animate-pulse text-lg">Loading article...</p>
      </main>
    }>
      <NewsArticleContent />
    </Suspense>
  );
}
