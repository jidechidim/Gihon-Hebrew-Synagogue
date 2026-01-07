"use client";

import { useState, useEffect, useContext } from "react";
import { useRouter, useParams } from "next/navigation";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import { SessionContext } from "@/app/layout";
import NewsForm from "@/components/admin/NewsForm";
import { deleteFile } from "@/lib/storage";

const supabase = createClientComponentClient();

export default function EditNewsPage() {
  const session = useContext(SessionContext);
  const router = useRouter();
  const { id } = useParams();
  const [news, setNews] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!session) return;
    const load = async () => {
      const { data, error } = await supabase.from("news").select("*").eq("id", id).single();
      if (error) return alert(error.message);
      setNews(data);
    };
    load();
  }, [session, id]);

  const updateNews = async (form) => {
    setLoading(true);
    try {
      await supabase.from("news").update({
        ...form,
        updated_at: new Date().toISOString(),
      }).eq("id", id);
      router.push("/admin/news");
    } catch (err) {
      alert("Update failed: " + err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!confirm("Delete this news?")) return;
    if (news.image) await deleteFile("news", news.image);
    await supabase.from("news").delete().eq("id", id);
    router.push("/admin/news");
  };

  const togglePublished = async () => {
    await supabase.from("news").update({ published: !news.published }).eq("id", id);
    setNews({ ...news, published: !news.published });
  };

  if (!session || !news) return <p>Loading…</p>;

  return (
    <div className="p-4 max-w-xl mx-auto">
      <h2>Edit News</h2>
      <button
        onClick={togglePublished}
        className={`px-2 py-1 rounded ${news.published ? "bg-green-500" : "bg-gray-400"} text-white`}
      >
        {news.published ? "Published" : "Draft"}
      </button>
      <button
        onClick={handleDelete}
        className="ml-2 px-2 py-1 rounded bg-red-600 text-white"
      >
        Delete
      </button>

      <NewsForm initialData={news} onSubmit={updateNews} loading={loading} />
    </div>
  );
}
