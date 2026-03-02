export async function uploadImage(file, folder = "uploads", options = {}) {
  if (!file) return null;

  const formData = new FormData();
  formData.append("file", file);
  formData.append("folder", folder || "general");

  if (options.currentUrl) {
    formData.append("currentUrl", options.currentUrl);
  }

  if (options.fileName) {
    formData.append("fileName", options.fileName);
  }

  const response = await fetch("/api/upload", {
    method: "POST",
    body: formData,
  });

  let payload = null;
  try {
    payload = await response.json();
  } catch {
    payload = null;
  }

  if (!response.ok) {
    const message = payload?.error || `Upload failed (${response.status})`;
    throw new Error(message);
  }

  return payload?.url || null;
}
