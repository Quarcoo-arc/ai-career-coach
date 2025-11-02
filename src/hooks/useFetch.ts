import { useState, useCallback } from "react";

interface UseFetchOptions {
  method?: "GET" | "POST" | "PUT" | "DELETE";
  headers?: Record<string, string>;
}

interface UseFetchReturn<T, D> {
  data: T | null;
  error: string | null;
  loading: boolean;
  fn: (data?: D) => Promise<void>;
}

/**
 * Generic React hook for making API route calls from client components.
 * Example:
 * const { fn, loading, data, error } = useFetch("/api/user/update", { method: "POST" });
 */
function useFetch<T, D>(
  url: string,
  options: UseFetchOptions = { method: "POST" }
): UseFetchReturn<T, D> {
  const [data, setData] = useState<T | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const fn = useCallback(
    async (bodyData?: D) => {
      setLoading(true);
      setError(null);
      try {
        const res = await fetch(url, {
          method: options.method ?? "POST",
          headers: {
            "Content-Type": "application/json",
            ...options.headers,
          },
          ...(bodyData ? { body: JSON.stringify(bodyData) } : {}),
        });

        if (!res.ok) {
          const text = await res.text();
          throw new Error(text || `Request failed: ${res.status}`);
        }

        const json = await res.json();
        setData(json);
      } catch (err: unknown) {
        const error = err instanceof Error ? err : Error(err as string);
        console.error(err);
        setError(error.message || "Something went wrong");
      } finally {
        setLoading(false);
      }
    },
    [url, options.method, options.headers]
  );

  return { data, error, loading, fn };
}

export default useFetch;
