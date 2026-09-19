export function formatDuration(seconds: number): string {
    const total = Math.max(0, Math.floor(seconds));
    const h = Math.floor(total / 3600);
    const m = Math.floor((total % 3600) / 60);
    const s = total % 60;
    const pad = (n: number) => n.toString().padStart(2, "0");
    return h > 0 ? `${h}:${pad(m)}:${pad(s)}` : `${m}:${pad(s)}`;
}

export function formatViews(count: number): string {
    if (count >= 1_000_000) return `${trimZero(count / 1_000_000)}M`;
    if (count >= 1_000) return `${trimZero(count / 1_000)}K`;
    return `${count}`;
}

function trimZero(value: number): string {
    return value.toFixed(1).replace(/\.0$/, "");
}

const TIME_AGO_UNITS: Record<
    string,
    { justNow: string; minute: string; hour: string; day: string; month: string; year: string }
> = {
    en: {
        justNow: "just now",
        minute: "m ago",
        hour: "h ago",
        day: "d ago",
        month: "mo ago",
        year: "y ago"
    },
    "en-us": {
        justNow: "just now",
        minute: "m ago",
        hour: "h ago",
        day: "d ago",
        month: "mo ago",
        year: "y ago"
    },
    id: {
        justNow: "baru saja",
        minute: "mnt lalu",
        hour: "jam lalu",
        day: "hr lalu",
        month: "bln lalu",
        year: "thn lalu"
    },
    "id-id": {
        justNow: "baru saja",
        minute: "mnt lalu",
        hour: "jam lalu",
        day: "hr lalu",
        month: "bln lalu",
        year: "thn lalu"
    },
    ja: {
        justNow: "たった今",
        minute: "分前",
        hour: "時間前",
        day: "日前",
        month: "ヶ月前",
        year: "年前"
    },
    "ja-jp": {
        justNow: "たった今",
        minute: "分前",
        hour: "時間前",
        day: "日前",
        month: "ヶ月前",
        year: "年前"
    }
};

export function formatTimeAgo(dateString: string, lang: string = "en-US"): string {
    const key = lang.toLowerCase();
    const unit =
        TIME_AGO_UNITS[key] ?? TIME_AGO_UNITS[key.split("-")[0]] ?? TIME_AGO_UNITS["en-us"];
    const diffSeconds = Math.max(0, (Date.now() - new Date(dateString).getTime()) / 1000);

    if (diffSeconds < 60) return unit.justNow;
    if (diffSeconds < 3600) return `${Math.floor(diffSeconds / 60)}${unit.minute}`;
    if (diffSeconds < 86400) return `${Math.floor(diffSeconds / 3600)}${unit.hour}`;
    if (diffSeconds < 2_592_000) return `${Math.floor(diffSeconds / 86400)}${unit.day}`;
    if (diffSeconds < 31_104_000) return `${Math.floor(diffSeconds / 2_592_000)}${unit.month}`;
    return `${Math.floor(diffSeconds / 31_104_000)}${unit.year}`;
}
