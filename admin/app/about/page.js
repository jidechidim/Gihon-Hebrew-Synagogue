"use client";
import { useState, useEffect } from "react";

export default function AboutAdmin() {
  const [data, setData] = useState(null);
  const [uploadingIntro, setUploadingIntro] = useState(false);
  const [uploadingBoard, setUploadingBoard] = useState(false);

  async function loadData() {
    const res = await fetch("/admin/api/about");
    setData(await res.json());
  }

  useEffect(() => {
    loadData();
  }, []);

  async function saveData() {
    await fetch("/admin/api/about", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    alert("✅ Saved!");
  }

  async function handleImageUpload(e, type) {
    const file = e.target.files[0];
    if (!file) return;
    type === "intro" ? setUploadingIntro(true) : setUploadingBoard(true);

    const formData = new FormData();
    formData.append("file", file);

    const res = await fetch("/admin/api/upload", {
      method: "POST",
      body: formData,
    });

    const json = await res.json();
    if (type === "intro") {
      setData({ ...data, intro: { ...data.intro, image: json.url } });
      setUploadingIntro(false);
    } else if (type === "board") {
      setData({ ...data, board: { ...data.board, image: json.url } });
      setUploadingBoard(false);
    }
  }

  if (!data) return <p>Loading...</p>;

  const handleValueChange = (index, value) => {
    const newValues = [...data.values];
    newValues[index] = value;
    setData({ ...data, values: newValues });
  };

  const addValue = () => setData({ ...data, values: [...data.values, ""] });
  const removeValue = (index) => {
    const newValues = [...data.values];
    newValues.splice(index, 1);
    setData({ ...data, values: newValues });
  };

  return (
    <div>
      <h3>About Page Editor</h3>

      {/* Intro */}
      <h4>Intro Section</h4>
      <input
        value={data.intro.title}
        onChange={(e) =>
          setData({ ...data, intro: { ...data.intro, title: e.target.value } })
        }
        placeholder="Intro Title"
      />
      <textarea
        value={data.intro.lede}
        onChange={(e) =>
          setData({ ...data, intro: { ...data.intro, lede: e.target.value } })
        }
        placeholder="Intro Lede"
        rows={4}
        style={{ width: "100%" }}
      />

      {/* Intro Image Upload */}
      <div style={{ marginTop: 10 }}>
        <label>Intro Image: </label>
        <input type="file" onChange={(e) => handleImageUpload(e, "intro")} />
        {uploadingIntro && <p>Uploading...</p>}
        {data.intro.image && (
          <div style={{ marginTop: 10 }}>
            <img src={data.intro.image} alt="Intro Preview" style={{ maxWidth: 300 }} />
          </div>
        )}
        <input
          value={data.intro.image_alt}
          onChange={(e) =>
            setData({ ...data, intro: { ...data.intro, image_alt: e.target.value } })
          }
          placeholder="Intro Image Alt"
        />
      </div>

      {/* Mission & Vision */}
      <h4>Mission & Vision</h4>
      <input
        value={data.mission_vision.mission.title}
        onChange={(e) =>
          setData({
            ...data,
            mission_vision: {
              ...data.mission_vision,
              mission: { ...data.mission_vision.mission, title: e.target.value },
            },
          })
        }
        placeholder="Mission Title"
      />
      <textarea
        value={data.mission_vision.mission.text}
        onChange={(e) =>
          setData({
            ...data,
            mission_vision: {
              ...data.mission_vision,
              mission: { ...data.mission_vision.mission, text: e.target.value },
            },
          })
        }
        placeholder="Mission Text"
        rows={3}
        style={{ width: "100%" }}
      />

      <input
        value={data.mission_vision.vision.title}
        onChange={(e) =>
          setData({
            ...data,
            mission_vision: {
              ...data.mission_vision,
              vision: { ...data.mission_vision.vision, title: e.target.value },
            },
          })
        }
        placeholder="Vision Title"
      />
      <textarea
        value={data.mission_vision.vision.text}
        onChange={(e) =>
          setData({
            ...data,
            mission_vision: {
              ...data.mission_vision,
              vision: { ...data.mission_vision.vision, text: e.target.value },
            },
          })
        }
        placeholder="Vision Text"
        rows={3}
        style={{ width: "100%" }}
      />

      {/* Values Array */}
      <h4>Values</h4>
      {data.values.map((val, idx) => (
        <div key={idx} style={{ marginBottom: 5 }}>
          <input
            value={val}
            onChange={(e) => handleValueChange(idx, e.target.value)}
            style={{ width: "80%" }}
          />
          <button onClick={() => removeValue(idx)} style={{ marginLeft: 5 }}>
            ❌
          </button>
        </div>
      ))}
      <button onClick={addValue}>➕ Add Value</button>

      {/* Board Image Upload */}
      {data.board && (
        <div style={{ marginTop: 20 }}>
          <h4>Board Section</h4>
          <label>Board Image: </label>
          <input type="file" onChange={(e) => handleImageUpload(e, "board")} />
          {uploadingBoard && <p>Uploading...</p>}
          {data.board.image && (
            <div style={{ marginTop: 10 }}>
              <img src={data.board.image} alt="Board Preview" style={{ maxWidth: 300 }} />
            </div>
          )}
          <input
            value={data.board.image_alt}
            onChange={(e) =>
              setData({ ...data, board: { ...data.board, image_alt: e.target.value } })
            }
            placeholder="Board Image Alt"
          />
          <input
            value={data.board.caption}
            onChange={(e) =>
              setData({ ...data, board: { ...data.board, caption: e.target.value } })
            }
            placeholder="Board Caption"
          />
          <input
            value={data.board.cta_text}
            onChange={(e) =>
              setData({ ...data, board: { ...data.board, cta_text: e.target.value } })
            }
            placeholder="Board CTA Text"
          />
          <input
            value={data.board.cta_link}
            onChange={(e) =>
              setData({ ...data, board: { ...data.board, cta_link: e.target.value } })
            }
            placeholder="Board CTA Link"
          />
        </div>
      )}

      <div style={{ marginTop: 20 }}>
        <button onClick={saveData}>Save Changes</button>
      </div>
    </div>
  );
}
