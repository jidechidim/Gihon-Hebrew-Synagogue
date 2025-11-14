"use client";

import { useState, useEffect, useContext } from "react";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import { SessionContext } from "../../layout";
import ImageUpload from "../../components/ImageUpload";

const supabase = createClientComponentClient();

export default function LeadershipAdmin() {
  const session = useContext(SessionContext);
  const [data, setData] = useState(null);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!session) return;

    async function loadData() {
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
    }

    loadData();
  }, [session]);

  if (!session) return <p>Checking access…</p>;
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
    newMembers[index][field] = value;
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
    <div>
      <h2>Leadership Page Editor</h2>

      {/* Hero Section */}
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

      {/* Members */}
      <h3>Members</h3>
      {data.members.map((member, i) => (
        <div key={member.id} style={{ border: "1px solid #ccc", padding: "10px", marginBottom: "10px" }}>
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

          <button onClick={() => removeMember(i)} style={{ marginTop: "5px" }}>Remove Member</button>
        </div>
      ))}
      <button onClick={addMember}>Add Member</button>

      <button onClick={saveData} disabled={saving} style={{ marginTop: 10 }}>
        {saving ? "Saving..." : "Save Changes"}
      </button>
    </div>
  );
}
