"use client";

import { useState, useEffect } from "react";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";

const supabase = createClientComponentClient();

export default function ContactAdmin() {
  const [session, setSession] = useState(null);
  const [data, setData] = useState(null);
  const [saving, setSaving] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      const { data: sessionData } = await supabase.auth.getSession();
      if (!sessionData.session) {
        window.location.href = "/admin/login";
        return;
      }
      setSession(sessionData.session);

      const { data: row } = await supabase
        .from("cms_content")
        .select("data")
        .eq("id", "contact")
        .single();

      setData(
        row?.data || { address: "", email: "", phones: [""], socials: [] }
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
      .upsert({ id: "contact", data });
    setSaving(false);

    if (error) console.error(error);
    else alert("✅ Changes saved!");
  };

  const updatePhone = (index, value) => {
    const newPhones = [...data.phones];
    newPhones[index] = value;
    setData({ ...data, phones: newPhones });
  };
  const addPhone = () => setData({ ...data, phones: [...data.phones, ""] });
  const removePhone = (index) =>
    setData({ ...data, phones: data.phones.filter((_, i) => i !== index) });

  const updateSocial = (index, field, value) => {
    const newSocials = [...data.socials];
    newSocials[index] = { ...newSocials[index], [field]: value };
    setData({ ...data, socials: newSocials });
  };
  const addSocial = () =>
    setData({ ...data, socials: [...data.socials, { platform: "", url: "" }] });
  const removeSocial = (index) =>
    setData({ ...data, socials: data.socials.filter((_, i) => i !== index) });

  return (
    <div style={{ maxWidth: 800, margin: "0 auto", padding: 20 }}>
      <h2>Contact Page Editor</h2>

      {/* Address Section */}
      <section style={{ border: "1px solid #ccc", padding: 16, marginBottom: 20 }}>
        <h3>Address & Email</h3>
        <label>Address</label>
        <input
          value={data.address}
          onChange={(e) => setData({ ...data, address: e.target.value })}
          style={{ width: "100%", marginBottom: 8 }}
        />

        <label>Email</label>
        <input
          value={data.email}
          onChange={(e) => setData({ ...data, email: e.target.value })}
          style={{ width: "100%" }}
        />
      </section>

      {/* Phones Section */}
      <section style={{ border: "1px solid #ccc", padding: 16, marginBottom: 20 }}>
        <h3>Phones</h3>
        {data.phones.map((phone, i) => (
          <div key={i} style={{ display: "flex", gap: 8, alignItems: "center", marginBottom: 8 }}>
            <input
              value={phone}
              onChange={(e) => updatePhone(i, e.target.value)}
              style={{ flex: 1 }}
            />
            <button
              type="button"
              onClick={() => removePhone(i)}
              style={{ background: "#e33", color: "#fff", border: "none", borderRadius: 4, padding: "4px 8px" }}
            >
              Remove
            </button>
          </div>
        ))}
        <button
          type="button"
          onClick={addPhone}
          style={{ padding: "6px 12px", marginTop: 4 }}
        >
          Add Phone
        </button>
      </section>

      {/* Social Links Section */}
      <section style={{ border: "1px solid #ccc", padding: 16, marginBottom: 20 }}>
        <h3>Social Links</h3>
        {data.socials.map((social, i) => (
          <div key={i} style={{ display: "flex", gap: 8, alignItems: "center", marginBottom: 8 }}>
            <input
              placeholder="Platform"
              value={social.platform}
              onChange={(e) => updateSocial(i, "platform", e.target.value)}
              style={{ flex: 1 }}
            />
            <input
              placeholder="URL"
              value={social.url}
              onChange={(e) => updateSocial(i, "url", e.target.value)}
              style={{ flex: 2 }}
            />
            <button
              type="button"
              onClick={() => removeSocial(i)}
              style={{ background: "#e33", color: "#fff", border: "none", borderRadius: 4, padding: "4px 8px" }}
            >
              Remove
            </button>
          </div>
        ))}
        <button
          type="button"
          onClick={addSocial}
          style={{ padding: "6px 12px", marginTop: 4 }}
        >
          Add Social
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
