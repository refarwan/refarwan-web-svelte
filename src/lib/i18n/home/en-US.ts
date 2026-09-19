import type { HomeTranslation } from "./types";

export const enUS: HomeTranslation = {
    metaTitle: "Aan Refarwan | Fullstack TypeScript Developer & Software Engineer",
    metaDescription:
        "Fullstack Developer specializing in modern JavaScript & TypeScript architectures. Building end-to-end web applications with adaptable experience across backend stacks like PHP.",
    hero: {
        role: "Fullstack JavaScript Developer",
        description:
            "I craft websites and web applications across both frontend and backend with passion. Based in Yogyakarta with high enthusiasm to deliver high-quality digital solutions.",
        viewProjects: "View Projects"
    },
    about: {
        title: "About Me",
        bio1: "I graduated from SMK N 1 Bantul majoring in Software Engineering. After graduating, I pursued self-taught web programming. I have a strong passion for building modern user interfaces and robust backend systems.",
        bio2: "Always keeping up-to-date with the latest JavaScript ecosystem and enjoying solving complex problems through clean, well-structured code.",
        experienceTitle: "Work Experience",
        experiences: [
            {
                role: "Web Programmer",
                company: "PT Fresh Galang Mandiri",
                period: "August 2022 - March 2023"
            },
            {
                role: "IT Support & Programmer",
                company: "Toko Kamera Mbantul",
                period: "June 2017 - July 2022"
            }
        ]
    },
    skills: {
        title: "Programming Skills",
        description:
            "Technologies and tools I frequently use to bring responsive, resilient application designs to life."
    },
    projects: {
        title: "Featured Projects",
        subtitle:
            "Selected work representing my expertise in managing data, complex states, and responsive interfaces.",
        items: [
            {
                id: "jualkamera",
                category: "Fullstack E-Commerce",
                projectName: "Website Jualkamera.com",
                description:
                    "A catalog website for the Mbantul Camera store with POS (Point of Sale) functionality, ensuring real-time stock updates as all transactions are recorded at the checkout register. Built with a focus on high performance and complex state management using a modern stack.",
                visitWebsite: "Visit Website",
                imageSrc: "/www.jualkamera.com.png",
                url: "https://jualkamera.com"
            },
            {
                id: "annorakreasi",
                category: "Corporate Training & HR Platform",
                projectName: "Website Annora Cipta Kreasi",
                description:
                    "Company profile and HR training platform (soft skills, public speaking, psychology service, capacity building). Features training class schedules, dynamic articles/blog, and high-performance interactive registration forms.",
                visitWebsite: "Visit Website",
                imageSrc: "/www.annorakreasi.com.png",
                url: "https://www.annorakreasi.com"
            }
        ]
    },
    cta: {
        title: "Let's Collaborate",
        description:
            "Interested in building a reliable platform or have an exciting project you want to realize together? Let's schedule a brief conversation.",
        button: "Get in Touch"
    }
};
