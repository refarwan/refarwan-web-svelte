import { ensureAccessToken } from "./authorized-http";

export async function clearFrontendCache(tag: string): Promise<void> {
    try {
        const token = await ensureAccessToken();
        if (!token) return;

        await fetch("/admin-panel/api/cache/clear", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`
            },
            body: JSON.stringify({ tag })
        });
    } catch (err) {
        console.error("Failed to clear frontend cache:", err);
    }
}
