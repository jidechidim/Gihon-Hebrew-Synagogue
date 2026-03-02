function toBinaryString(bytes) {
  let binary = "";
  const chunkSize = 0x8000;

  for (let index = 0; index < bytes.length; index += chunkSize) {
    const chunk = bytes.subarray(index, index + chunkSize);
    binary += String.fromCharCode(...chunk);
  }

  return binary;
}

export function encodeCmsPreviewData(payload) {
  try {
    const json = JSON.stringify(payload ?? {});

    if (typeof window === "undefined") {
      return Buffer.from(json, "utf8").toString("base64");
    }

    const bytes = new TextEncoder().encode(json);
    return btoa(toBinaryString(bytes));
  } catch {
    return "";
  }
}

export function decodeCmsPreviewData(encodedPayload) {
  if (!encodedPayload || typeof encodedPayload !== "string") return null;

  try {
    if (typeof window === "undefined") {
      return JSON.parse(Buffer.from(encodedPayload, "base64").toString("utf8"));
    }

    const binary = atob(encodedPayload);
    const bytes = Uint8Array.from(binary, (char) => char.charCodeAt(0));
    return JSON.parse(new TextDecoder().decode(bytes));
  } catch {
    return null;
  }
}
