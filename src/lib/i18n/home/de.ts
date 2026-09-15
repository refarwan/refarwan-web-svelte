import type { HomeTranslation } from './types';

export const de: HomeTranslation = {
	metaTitle: 'Aan Refarwan | Fullstack TypeScript-Entwickler & Software Engineer',
	metaDescription:
		'Fullstack-Entwickler mit Spezialisierung auf moderne JavaScript- und TypeScript-Architekturen. Erstellung von End-to-End-Webanwendungen mit adaptiver Backend-Erfahrung.',
	hero: {
		role: 'Fullstack JavaScript-Entwickler',
		description:
			'Mit Leidenschaft erstelle ich Webseiten und Applikationen sowohl im Frontend als auch im Backend. Ansässig in Yogyakarta mit hohem Qualitätsanspruch.',
		viewProjects: 'Projekte Ansehen'
	},
	about: {
		title: 'Über Mich',
		bio1: 'Absolvent der SMK N 1 Bantul mit Schwerpunkt Software-Engineering. Anschließend vertiefte ich die Webprogrammierung autodidaktisch mit Begeisterung für moderne UIs und robuste Backends.',
		bio2: 'Stets auf dem neuesten Stand des JavaScript-Ökosystems und motiviert, komplexe Herausforderungen mit sauberem, gut strukturiertem Code zu lösen.',
		experienceTitle: 'Berufserfahrung',
		experiences: [
			{
				role: 'Web-Programmierer',
				company: 'PT Fresh Galang Mandiri',
				period: 'August 2022 - März 2023'
			},
			{
				role: 'IT-Support & Programmierer',
				company: 'Toko Kamera Mbantul',
				period: 'Juni 2017 - Juli 2022'
			}
		]
	},
	skills: {
		title: 'Programmierkenntnisse',
		description:
			'Technologien und Tools, die ich regelmäßig nutze, um reaktionsschnelle und stabile Anwendungen umzusetzen.'
	},
	projects: {
		title: 'Ausgewählte Projekte',
		subtitle:
			'Ausgewählte Arbeit, die meine Expertise in Datenmanagement, komplexen Zuständen und responsiven Schnittstellen demonstriert.',
		items: [
			{
				id: 'jualkamera',
				category: 'Fullstack E-Commerce',
				projectName: 'Webseite Jualkamera.com',
				description:
					'Katalog-Webseite für das Kamerageschäft Mbantul mit POS-Funktionalität (Kassensystem), die bei Kassentransaktionen eine Echtzeit-Bestandsaktualisierung gewährleistet.',
				visitWebsite: 'Webseite Besuchen',
				imageSrc: '/www.jualkamera.com.png',
				url: 'https://jualkamera.com'
			},
			{
				id: 'annorakreasi',
				category: 'HR-Schulungs- & Weiterbildungsplattform',
				projectName: 'Webseite Annora Cipta Kreasi',
				description:
					'Unternehmensprofil und HR-Weiterbildungsplattform (Soft Skills, Rhetorik, psychologische Beratung, Capacity Building). Mit Kursplanungssystem, dynamischem Blog und leistungsstarken interaktiven Anmeldeformularen.',
				visitWebsite: 'Webseite Besuchen',
				imageSrc: '/www.annorakreasi.com.png',
				url: 'https://www.annorakreasi.com'
			}
		]
	},
	cta: {
		title: 'Lassen Sie uns zusammenarbeiten',
		description:
			'Möchten Sie eine zuverlässige Plattform aufbauen oder haben Sie ein spannendes Projekt? Lassen Sie uns gerne kurz austauschen.',
		button: 'Kontakt Aufnehmen'
	}
};
