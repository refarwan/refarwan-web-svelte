export const getAdminLangCookie = (): string => {
    const match = /(?:^|; )admin_lang=([^;]+)/.exec(document.cookie);
    return match ? decodeURIComponent(match[1]) : "en-US";
};
