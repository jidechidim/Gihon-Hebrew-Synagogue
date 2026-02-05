"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { supabase } from "@lib/supabase/client";
import Image from "next/image";
import Link from "next/link";
import "./newsarticle.css";

export default function NewsArticleContent() {
  const searchParams = useSearchParams();
  const slug = searchParams.get("slug");

  const [article, setArticle] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!slug) return;

    async function fetchArticle() {
      try {
        const { data, error } = await supabase
          .from("news")
          .select("*")
          .eq("id", slug)
          .single();

        if (error) throw error;
        setArticle(data);
      } catch (err) {
        console.error("Error fetching article:", err);
      } finally {
        setLoading(false);
      }
    }

    fetchArticle();
  }, [slug]);

  if (loading) {
    return (
      <main className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
        <p className="text-gray-500 animate-pulse text-lg">Loading article...</p>
      </main>
    );
  }

  if (!article) {
    return (
      <main className="min-h-screen flex flex-col items-center justify-center bg-gray-50 px-4">
        <p className="text-gray-500 mb-4 text-lg">Article not found.</p>
        <Link href="/news" className="back-btn">
          ← Back to News
        </Link>
      </main>
    );
  }

  return (
    <main className="min-h-screen flex flex-col items-center bg-gray-50 px-4">
      <h2 className="article-heading">News Article</h2>

      <section className="article-container">
        {article.image && (
          <div className="my-6 rounded-lg overflow-hidden shadow-sm">
            <Image
              src={article.image}
              alt={article.title}
              width={800}
              height={450}
              className="w-full h-auto object-cover"
            />
          </div>
        )}

        <h1>{article.title}</h1>

        {article.summary && <p>{article.summary}</p>}

        {article.content && (
          <div dangerouslySetInnerHTML={{ __html: article.content }} />
        )}

        <div className="text-left">
          <Link href="/news" className="back-btn">
            ← Back to News
          </Link>
        </div>
      </section>
    </main>
  );
}
