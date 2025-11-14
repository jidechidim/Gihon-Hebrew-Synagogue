"use client";

import { useState, useEffect } from "react";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import ImageUpload from "../../components/ImageUpload";

const supabase = createClientComponentClient();

export default function LeadershipAdmin() {
  const [session, setSession] = useState(null);
  const [data, setData] = useState(null);
  const [saving, setSaving] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      // Check session
      const { data: sessionData } = await supabase.auth.getSession();
      if (!sessionData.session) {
        window.location.href = "/admin/login";
        return;
      }
      setSession(sessionData.session);

      // Load leadership data
      const { data: row } = await supabase
        .from("cms_content")
        .select("data")
        .eq("id", "leadership")
        .single();

      setData(
        row?.data || {
          hero: { image: "", alt: "", figcaption: "" },
          members: [],
        }
      );

      setLoading(false);
    }

    fetchData();
  }, []);

  if (loading) return <p>Checking access…</p>;
  if (!session) return null;
  if (!data) return <p>Loading content…</p>;

  const saveData = async () => {
    setSaving(true);
    const { error } = await supabase
      .from("cms_content")
      .upsert({ id: "leadership", data });
    setSaving(false);

    if (error) console.error(error);
    else alert("✅ Changes saved!");
  };

  const updateHero = (field, value) =>
    setData({ ...data, hero: { ...data.hero, [field]: value } });

  const updateMember = (index, field, value) => {
    const newMembers = [...data.members];
    newMembers[index] = { ...newMembers[index], [field]: value };
    setData({ ...data, members: newMembers });
  };

  const addMember = () => {
    const newId = data.members.length > 0 ? Math.max(...data.members.map(m => m.id)) + 1 : 1;
    setData({
      ...data,
      members: [
        ...data.members,
        { id: newId, name: "", role: "", image: "", alt: "" },
      ],
    });
  };

  const removeMember = (index) => {
    const newMembers = data.members.filter((_, i) => i !== index);
    setData({ ...data, members: newMembers });
  };

  return (
    <div style={{ maxWidth: 800, margin: "0 auto", padding: 20 }}>
      <h2>Leadership Page Editor</h2>

      {/* Hero Section */}
      <section style={{ border: "1px solid #ccc", padding: 16, marginBottom: 20 }}>
        <h3>Hero Section</h3>
        <label>Figcaption</label>
        <input value={data.hero.figcaption} onChange={(e) => updateHero("figcaption", e.target.value)} />
        <label>Alt Text</label>
        <input value={data.hero.alt} onChange={(e) => updateHero("alt", e.target.value)} />
        <ImageUpload
          label="Hero Image"
          value={data.hero.image}
          onChange={(url) => updateHero("image", url)}
          bucket="content"
        />
      </section>

      {/* Members Section */}
      <section style={{ border: "1px solid #ccc", padding: 16, marginBottom: 20 }}>
        <h3>Members</h3>
        {data.members.map((member, i) => (
          <section
            key={member.id}
            style={{ border: "1px solid #aaa", padding: 12, marginBottom: 12 }}
          >
            <label>Name</label>
            <input value={member.name} onChange={(e) => updateMember(i, "name", e.target.value)} />

            <label>Role</label>
            <input value={member.role} onChange={(e) => updateMember(i, "role", e.target.value)} />

            <label>Alt Text</label>
            <input value={member.alt} onChange={(e) => updateMember(i, "alt", e.target.value)} />

            <ImageUpload
              label="Member Image"
              value={member.image}
              onChange={(url) => updateMember(i, "image", url)}
              bucket="content"
            />

            <button
              type="button"
              onClick={() => removeMember(i)}
              style={{ marginTop: 8, background: "#e33", color: "#fff", padding: "4px 8px", border: "none", borderRadius: 4 }}
            >
              Remove Member
            </button>
          </section>
        ))}
        <button
          type="button"
          onClick={addMember}
          style={{ padding: "6px 12px", marginBottom: 10 }}
        >
          Add Member
        </button>
      </section>

      <button
        onClick={saveData}
        disabled={saving}
        style={{ marginTop: 10, padding: "8px 16px", fontSize: 16 }}
      >
        {saving ? "Saving..." : "Save Changes"}
      </button>
    </div>
  );
}
