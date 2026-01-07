"use client";

import { useContext, useState } from "react";
import { useRouter } from "next/navigation";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import { SessionContext } from "@/app/layout";
import EventForm from "@/components/admin/EventForm";

const supabase = createClientComponentClient();

const EMPTY_EVENT = { title: "", date: "", summary: "", location: "", register_url: "", image: "" };

export default function NewEventPage() {
  const session = useContext(SessionContext);
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  if (!session) return <p>Checking access…</p>;

  const createEvent = async (form) => {
    setLoading(true);
    const { error } = await supabase.from("events").insert([
      { ...form, created_at: new Date().toISOString(), updated_at: new Date().toISOString() },
    ]);
    if (error) { alert(error.message); setLoading(false); return; }
    router.push("/admin/events");
  };

  return <EventForm initialData={EMPTY_EVENT} onSubmit={createEvent} loading={loading} />;
}
