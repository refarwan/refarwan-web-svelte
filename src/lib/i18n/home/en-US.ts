import type { HomeTranslation } from "./types";

export const enUS: HomeTranslation = {
    metaTitle: "Aan Refarwan | Fullstack TypeScript Developer & Software Engineer",
    metaDescription:
        "Fullstack Developer specializing in modern JavaScript & TypeScript architectures. Building end-to-end web applications with adaptable experience across backend stacks like PHP.",
    hero: {
        role: "Full-Stack TypeScript & Performance Engineer ",
        description:
            "I specialize in modern TypeScript architectures across frontend and backend—leveraging SvelteKit, Next.js, Bun, Hono, and PostgreSQL to deliver minimal latency, clean code, and zero technical debt. Based in Indonesia, working with clients worldwide.",
        viewProjects: "View Projects"
    },
    about: {
        title: "About Me",
        bio1: "I am a software engineer specializing in modern TypeScript architectures across frontend and backend. Starting from a strong foundation in Software Engineering, I have continuously advanced my technical expertise—architecting high-performance backend systems and responsive user interfaces.",
        bio2: "Always adapting to cutting-edge web ecosystems—such as SvelteKit, Bun, and Hono—I focus on efficient data architectures, clean and maintainable code, and scalable solutions that eliminate technical debt.",
        experienceTitle: "Work Experience",
        experiences: [
            {
                role: "Senior Backend Engineer",
                company: "Somactech",
                period: "September 2025 - Present"
            },
            {
                role: "Independent Full-Stack Contractor",
                company: "Freelance",
                period: "April 2023 - Present"
            },
            {
                role: "Head of Product & Engineering",
                company: "Bitbite",
                period: "May 2023 - December 2023"
            },
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
