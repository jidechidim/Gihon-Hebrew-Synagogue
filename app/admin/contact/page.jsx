"use client";

import { useState, useEffect, useContext } from "react";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import { SessionContext } from "../../layout";

export const runtime = "nodejs";

const supabase = createClientComponentClient();

export default function ContactAdmin() {
  const session = useContext(SessionContext);
  const [data, setData] = useState(null);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!session) return;

    async function loadData() {
      const { data: row } = await supabase
        .from("cms_content")
        .select("data")
        .eq("id", "contact")
        .single();

      setData(
        row?.data || { address: "", email: "", phones: [""], socials: [] }
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
      .upsert({ id: "contact", data });
    setSaving(false);

    if (error) console.error(error);
    else alert("✅ Changes saved!");
  };

  // Phone handlers
  const updatePhone = (index, value) => {
    const newPhones = [...data.phones];
    newPhones[index] = value;
    setData({ ...data, phones: newPhones });
  };

  const addPhone = () => setData({ ...data, phones: [...data.phones, ""] });
  const removePhone = (index) =>
    setData({ ...data, phones: data.phones.filter((_, i) => i !== index) });

  // Social handlers
  const updateSocial = (index, field, value) => {
    const newSocials = [...data.socials];
    newSocials[index][field] = value;
    setData({ ...data, socials: newSocials });
  };

  const addSocial = () =>
    setData({ ...data, socials: [...data.socials, { platform: "", url: "" }] });

  const removeSocial = (index) =>
    setData({ ...data, socials: data.socials.filter((_, i) => i !== index) });

  return (
    <div>
      <h2>Contact Page Editor</h2>

      <label>Address</label>
      <input
        value={data.address}
        onChange={(e) => setData({ ...data, address: e.target.value })}
      />

      <label>Email</label>
      <input
        value={data.email}
        onChange={(e) => setData({ ...data, email: e.target.value })}
      />

      <h3>Phones</h3>
      {data.phones.map((phone, i) => (
        <div key={i} style={{ marginBottom: "5px" }}>
          <input
            value={phone}
            onChange={(e) => updatePhone(i, e.target.value)}
          />
          <button onClick={() => removePhone(i)}>Remove</button>
        </div>
      ))}
      <button onClick={addPhone}>Add Phone</button>

      <h3>Social Links</h3>
      {data.socials.map((social, i) => (
        <div key={i} style={{ marginBottom: "5px" }}>
          <input
            placeholder="Platform"
            value={social.platform}
            onChange={(e) => updateSocial(i, "platform", e.target.value)}
          />
          <input
            placeholder="URL"
            value={social.url}
            onChange={(e) => updateSocial(i, "url", e.target.value)}
          />
          <button onClick={() => removeSocial(i)}>Remove</button>
        </div>
      ))}
      <button onClick={addSocial}>Add Social</button>

      <button onClick={saveData} disabled={saving} style={{ marginTop: 10 }}>
        {saving ? "Saving..." : "Save Changes"}
      </button>
    </div>
  );
}
