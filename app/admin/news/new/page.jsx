"use client";

import { useContext, useState } from "react";
import { useRouter } from "next/navigation";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import { SessionContext } from "@/app/layout";
import NewsForm from "@/components/admin/NewsForm";

const supabase = createClientComponentClient();

const EMPTY_NEWS = { title: "", date: "", summary: "", content: "", image: "" };

export default function NewNewsPage() {
  const session = useContext(SessionContext);
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  if (!session) return <p>Checking access…</p>;

  const createNews = async (form) => {
    setLoading(true);
    const { error } = await supabase.from("news").insert([
      { ...form, created_at: new Date().toISOString(), updated_at: new Date().toISOString() },
    ]);
    if (error) { alert(error.message); setLoading(false); return; }
    router.push("/admin/news");
  };

  return <NewsForm initialData={EMPTY_NEWS} onSubmit={createNews} loading={loading} />;
}
