"use client";
import { useState, useEffect } from "react";

export default function LeadershipAdmin() {
  const [data, setData] = useState(null);
  const [uploadingHero, setUploadingHero] = useState(false);
  const [uploadingMembers, setUploadingMembers] = useState({}); // track uploading per member id

  async function loadData() {
    const res = await fetch("/admin/api/leadership");
    setData(await res.json());
  }

  useEffect(() => {
    loadData();
  }, []);

  async function saveData() {
    await fetch("/admin/api/leadership", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    alert("✅ Saved!");
  }

  // Hero upload
  async function handleHeroUpload(e) {
    const file = e.target.files[0];
    if (!file) return;
    setUploadingHero(true);

    const formData = new FormData();
    formData.append("file", file);

    const res = await fetch("/admin/api/upload", { method: "POST", body: formData });
    const json = await res.json();
    setData({ ...data, hero: { ...data.hero, image: json.url } });
    setUploadingHero(false);
  }

  // Member upload
  async function handleMemberUpload(e, idx) {
    const file = e.target.files[0];
    if (!file) return;

    const memberId = data.members[idx].id;
    setUploadingMembers({ ...uploadingMembers, [memberId]: true });

    const formData = new FormData();
    formData.append("file", file);

    const res = await fetch("/admin/api/upload", { method: "POST", body: formData });
    const json = await res.json();

    const members = [...data.members];
    members[idx].image = json.url;
    setData({ ...data, members });

    setUploadingMembers({ ...uploadingMembers, [memberId]: false });
  }

  // Handlers for members array
  const updateMember = (index, key, value) => {
    const members = [...data.members];
    members[index][key] = value;
    setData({ ...data, members });
  };

  const addMember = () => {
    const nextId = data.members.length + 1;
    const newMember = { id: nextId, name: "", role: "", image: "", alt: "" };
    setData({ ...data, members: [...data.members, newMember] });
  };

  const removeMember = (index) => {
    const members = [...data.members];
    members.splice(index, 1);
    setData({ ...data, members });
  };

  if (!data) return <p>Loading...</p>;

  return (
    <div>
      <h3>Leadership Page Editor</h3>

      {/* Hero */}
      <h4>Hero Section</h4>
      <input
        value={data.hero.alt}
        onChange={(e) => setData({ ...data, hero: { ...data.hero, alt: e.target.value } })}
        placeholder="Hero Alt Text"
      />
      <input
        value={data.hero.figcaption}
        onChange={(e) => setData({ ...data, hero: { ...data.hero, figcaption: e.target.value } })}
        placeholder="Hero Caption"
      />
      <div>
        <label>Hero Image: </label>
        <input type="file" onChange={handleHeroUpload} />
        {uploadingHero && <p>Uploading...</p>}
        {data.hero.image && (
          <div style={{ marginTop: 10 }}>
            <img src={data.hero.image} alt="Hero Preview" style={{ maxWidth: 300 }} />
          </div>
        )}
      </div>

      {/* Members */}
      <h4>Members</h4>
      {data.members.map((member, idx) => (
        <div
          key={member.id}
          style={{ border: "1px solid #ccc", padding: "10px", marginBottom: "10px" }}
        >
          <input
            value={member.name}
            onChange={(e) => updateMember(idx, "name", e.target.value)}
            placeholder="Name"
          />
          <input
            value={member.role}
            onChange={(e) => updateMember(idx, "role", e.target.value)}
            placeholder="Role"
          />
          <input
            value={member.alt}
            onChange={(e) => updateMember(idx, "alt", e.target.value)}
            placeholder="Alt Text"
          />
          <label>
            Solo:
            <input
              type="checkbox"
              checked={member.solo || false}
              onChange={(e) => updateMember(idx, "solo", e.target.checked)}
            />
          </label>
          <div>
            <label>Member Image: </label>
            <input type="file" onChange={(e) => handleMemberUpload(e, idx)} />
            {uploadingMembers[member.id] && <p>Uploading...</p>}
            {member.image && (
              <div style={{ marginTop: 10 }}>
                <img src={member.image} alt="Member Preview" style={{ maxWidth: 200 }} />
              </div>
            )}
          </div>
          <button onClick={() => removeMember(idx)}>❌ Remove</button>
        </div>
      ))}
      <button onClick={addMember}>➕ Add Member</button>

      <div style={{ marginTop: 20 }}>
        <button onClick={saveData}>Save Changes</button>
      </div>
    </div>
  );
}
