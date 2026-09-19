import type { HomeTranslation } from "./types";

export const idID: HomeTranslation = {
    metaTitle: "Aan Refarwan | Fullstack TypeScript Developer & Software Engineer",
    metaDescription:
        "Fullstack Developer yang berfokus pada arsitektur JavaScript & TypeScript modern. Membangun aplikasi web end-to-end dengan keahlian adaptif di backend seperti PHP.",
    hero: {
        role: "Fullstack JavaScript Developer",
        description:
            "Membangun website dan aplikasi web dari sisi frontend hingga backend dengan dedikasi tinggi. Berdomisili di Yogyakarta dengan antusiasme untuk menghadirkan solusi digital berkualitas.",
        viewProjects: "Lihat Proyek"
    },
    about: {
        title: "Tentang Saya",
        bio1: "Saya lulusan SMK N 1 Bantul jurusan Rekayasa Perangkat Lunak. Setelah lulus, saya melanjutkan belajar pemrograman web secara otodidak. Saya memiliki ketertarikan mendalam dalam menciptakan antarmuka modern serta sistem backend yang andal.",
        bio2: "Selalu mengikuti perkembangan ekosistem JavaScript terbaru dan senang memecahkan masalah kompleks melalui kode yang bersih dan terstruktur.",
        experienceTitle: "Pengalaman Kerja",
        experiences: [
            {
                role: "Web Programmer",
                company: "PT Fresh Galang Mandiri",
                period: "Agustus 2022 - Maret 2023"
            },
            {
                role: "IT Support & Programmer",
                company: "Toko Kamera Mbantul",
                period: "Juni 2017 - Juli 2022"
            }
        ]
    },
    skills: {
        title: "Keahlian Pemrograman",
        description:
            "Teknologi dan tools yang sering saya gunakan untuk mewujudkan desain aplikasi yang responsif dan berkinerja tinggi."
    },
    projects: {
        title: "Proyek Unggulan",
        subtitle:
            "Karya pilihan yang merepresentasikan keahlian saya dalam pengelolaan data, state kompleks, dan antarmuka responsif.",
        items: [
            {
                id: "jualkamera",
                category: "Fullstack E-Commerce",
                projectName: "Website Jualkamera.com",
                description:
                    "Website katalog toko Kamera Mbantul dengan fitur POS (Point of Sale), sehingga stok produk selalu terbarui secara otomatis secara real-time saat transaksi terjadi di kasir. Dibangun dengan fokus pada performa tinggi dan manajemen state kompleks menggunakan modern stack.",
                visitWebsite: "Kunjungi Website",
                imageSrc: "/www.jualkamera.com.png",
                url: "https://jualkamera.com"
            },
            {
                id: "annorakreasi",
                category: "Platform Edukasi & Pelatihan SDM",
                projectName: "Website Annora Cipta Kreasi",
                description:
                    "Website profil perusahaan dan platform pelatihan SDM (soft skills, public speaking, psychology service, capacity building). Dilengkapi sistem manajemen jadwal kelas, artikel/blog, serta formulir pendaftaran interaktif berkinerja tinggi.",
                visitWebsite: "Kunjungi Website",
                imageSrc: "/www.annorakreasi.com.png",
                url: "https://www.annorakreasi.com"
            }
        ]
    },
    cta: {
        title: "Mari Berkolaborasi",
        description:
            "Tertarik membangun platform yang andal atau memiliki proyek menarik yang ingin diwujudkan bersama? Mari jadwalkan obrolan singkat.",
        button: "Hubungi Saya"
    }
};
