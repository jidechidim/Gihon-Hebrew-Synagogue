const DEFAULT_SUPABASE_TIMEOUT_MS = 4000;

function resolveTimeoutMs() {
  const configured = Number(process.env.SUPABASE_FETCH_TIMEOUT_MS || "");

  if (Number.isFinite(configured) && configured > 0) {
    return configured;
  }

  return DEFAULT_SUPABASE_TIMEOUT_MS;
}

export function createTimeoutFetch(timeoutMs = resolveTimeoutMs()) {
  return async function timeoutFetch(input, init = {}) {
    if (typeof fetch !== "function") {
      throw new Error("Global fetch is not available in this runtime.");
    }

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), timeoutMs);

    let abortHandler = null;
    if (init.signal) {
      if (init.signal.aborted) {
        controller.abort();
      } else {
        abortHandler = () => controller.abort();
        init.signal.addEventListener("abort", abortHandler, { once: true });
      }
    }

    try {
      return await fetch(input, {
        ...init,
        signal: controller.signal,
      });
    } finally {
      clearTimeout(timeoutId);
      if (abortHandler && init.signal) {
        init.signal.removeEventListener("abort", abortHandler);
      }
    }
  };
}

export const supabaseTimeoutFetch = createTimeoutFetch();
