import axios from "axios";

export function axiosErrorMessage(err: unknown, fallback: string): string {
    if (axios.isAxiosError<{ message?: string }>(err) && err.response?.data.message) {
        return err.response.data.message;
    }
    return fallback;
}
