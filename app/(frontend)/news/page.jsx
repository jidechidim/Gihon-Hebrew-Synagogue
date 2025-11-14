"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import "/public/css/news.css";

export const runtime = "nodejs";

const supabase = createClientComponentClient();

export default function NewsPage() {
  const [news, setNews] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchNews() {
      try {
        const { data: newsRes, error: newsError } = await supabase
          .from("news")
          .select("id, title, image, summary, date, content")
          .order("date", { ascending: false });

        if (newsError) throw newsError;

        console.log("✅ News fetched:", newsRes);
        setNews(newsRes || []);
      } catch (err) {
        console.error("❌ Error fetching news:", err);
        setNews([]);
      } finally {
        setLoading(false);
      }
    }

    fetchNews();
  }, []);

  return (
    <main className="page">
      {/* ===== Page Title ===== */}
      <section className="news-head text-center py-12">
        <div className="container narrow center">
          <h1 className="text-4xl font-small">Latest from Gihon</h1>
        </div>
      </section>

      {/* ===== News Grid ===== */}
      <section className="news-grid container mx-auto px-4 py-10 grid gap-8 md:grid-cols-2 lg:grid-cols-3">
        {loading && <p className="col-span-full text-center">Loading news...</p>}

        {!loading && news.length === 0 && (
          <p className="col-span-full text-center">No news available yet.</p>
        )}

        {!loading &&
          news.map((post) => (
            <article
              key={post.id}
              className="post bg-white rounded-lg shadow hover:shadow-lg transition p-4 flex flex-col"
            >
              {/* Image */}
              {post.image && (
                <Link
                  href={`/newsarticle?slug=${encodeURIComponent(post.id)}`}
                  className="post-media block"
                >
                  <Image
                    src={post.image}
                    alt={post.title || "News image"}
                    width={600}
                    height={400}
                    className="rounded-md object-cover w-full h-64"
                  />
                </Link>
              )}

              {/* Content */}
              <div className="post-body mt-4 flex flex-col flex-grow">
                <h3 className="post-title text-xl font-semibold mb-2">
                  <Link
                    href={`/newsarticle?slug=${encodeURIComponent(post.id)}`}
                    className="hover:text-blue-600 transition"
                  >
                    {post.title}
                  </Link>
                </h3>
                <p className="post-excerpt text-gray-600 flex-grow">
                  {post.summary || ""}
                </p>
                <Link
                  href={`/newsarticle?slug=${encodeURIComponent(post.id)}`}
                  className="post-more text-blue-600 font-medium mt-4 inline-block"
                >
                  Read More →
                </Link>
              </div>
            </article>
          ))}
      </section>
    </main>
  );
}
