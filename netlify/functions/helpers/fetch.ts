export async function fetchJSON<T>(
    url: string,
    options?: RequestInit,
    retries = 3,
    delay = 500,
): Promise<T> {
    for (let i = 0; i < retries; i++) {
        try {
            const res = await fetch(url, options);
            if (!res.ok) throw new Error(`Fetch failed: ${url}`);
            return (await res.json()) as T;
        } catch (err) {
            if (i === retries - 1) throw err;
            await new Promise((r) => setTimeout(r, delay));
        }
    }

    // esto nunca se alcanza, pero TS lo exige
    throw new Error("Unreachable");
}