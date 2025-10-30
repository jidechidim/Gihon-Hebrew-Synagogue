"use client";
import { useState, useEffect } from "react";

export default function ContactAdmin() {
  const [data, setData] = useState(null);

  async function loadData() {
    const res = await fetch("/admin/api/contact");
    setData(await res.json());
  }

  useEffect(() => {
    loadData();
  }, []);

  async function saveData() {
    await fetch("/admin/api/contact", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    alert("✅ Saved!");
  }

  if (!data) return <p>Loading...</p>;

  // Handlers for phones array
  const updatePhone = (index, value) => {
    const phones = [...data.phones];
    phones[index] = value;
    setData({ ...data, phones });
  };

  const addPhone = () => setData({ ...data, phones: [...data.phones, ""] });
  const removePhone = (index) => {
    const phones = [...data.phones];
    phones.splice(index, 1);
    setData({ ...data, phones });
  };

  // Handlers for socials array
  const updateSocial = (index, key, value) => {
    const socials = [...data.socials];
    socials[index][key] = value;
    setData({ ...data, socials });
  };

  const addSocial = () => setData({ ...data, socials: [...data.socials, { platform: "", url: "" }] });
  const removeSocial = (index) => {
    const socials = [...data.socials];
    socials.splice(index, 1);
    setData({ ...data, socials });
  };

  return (
    <div>
      <h3>Contact Page Editor</h3>

      <h4>Address & Email</h4>
      <input
        value={data.address}
        onChange={(e) => setData({ ...data, address: e.target.value })}
        placeholder="Address"
      />
      <input
        value={data.email}
        onChange={(e) => setData({ ...data, email: e.target.value })}
        placeholder="Email"
      />

      <h4>Phones</h4>
      {data.phones.map((phone, idx) => (
        <div key={idx}>
          <input
            value={phone}
            onChange={(e) => updatePhone(idx, e.target.value)}
            placeholder="Phone number"
          />
          <button onClick={() => removePhone(idx)}>❌</button>
        </div>
      ))}
      <button onClick={addPhone}>➕ Add Phone</button>

      <h4>Social Links</h4>
      {data.socials.map((social, idx) => (
        <div key={idx}>
          <input
            value={social.platform}
            onChange={(e) => updateSocial(idx, "platform", e.target.value)}
            placeholder="Platform"
          />
          <input
            value={social.url}
            onChange={(e) => updateSocial(idx, "url", e.target.value)}
            placeholder="URL"
          />
          <button onClick={() => removeSocial(idx)}>❌</button>
        </div>
      ))}
      <button onClick={addSocial}>➕ Add Social</button>

      <div style={{ marginTop: 20 }}>
        <button onClick={saveData}>Save Changes</button>
      </div>
    </div>
  );
}
