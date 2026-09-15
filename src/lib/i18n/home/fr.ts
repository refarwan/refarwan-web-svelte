import type { HomeTranslation } from './types';

export const fr: HomeTranslation = {
	metaTitle: 'Aan Refarwan | Développeur Fullstack TypeScript & Ingénieur Logiciel',
	metaDescription:
		"Développeur Fullstack spécialisé dans les architectures JavaScript & TypeScript modernes. Conception d'applications web de bout en bout avec expérience adaptable.",
	hero: {
		role: 'Développeur Fullstack JavaScript',
		description:
			'Je conçois des applications web frontend et backend avec passion. Basé à Yogyakarta avec un grand enthousiasme pour offrir des solutions numériques de haute qualité.',
		viewProjects: 'Voir les Projets'
	},
	about: {
		title: 'À Propos',
		bio1: "Diplômé de SMK N 1 Bantul en génie logiciel, j'ai ensuite poursuivi mon apprentissage du développement web en autodidacte. Passionné par les interfaces modernes et les systèmes backend solides.",
		bio2: "Toujours à l'affût des nouveautés de l'écosystème JavaScript, j'aime résoudre des problèmes complexes grâce à un code propre et structuré.",
		experienceTitle: 'Expérience Professionnelle',
		experiences: [
			{
				role: 'Programmeur Web',
				company: 'PT Fresh Galang Mandiri',
				period: 'Août 2022 - Mars 2023'
			},
			{
				role: 'Support IT & Programmeur',
				company: 'Toko Kamera Mbantul',
				period: 'Juin 2017 - Juillet 2022'
			}
		]
	},
	skills: {
		title: 'Compétences Techniques',
		description:
			"Technologies et outils que j'utilise au quotidien pour donner vie à des applications réactives et résilientes."
	},
	projects: {
		title: 'Projets en Vedette',
		subtitle:
			'Une réalisation sélectionnée illustrant mon expertise en gestion des données, états complexes et interfaces réactives.',
		items: [
			{
				id: 'jualkamera',
				category: 'E-Commerce Fullstack',
				projectName: 'Site Web Jualkamera.com',
				description:
					'Site catalogue pour la boutique Mbantul Camera avec fonction caisse/POS, assurant une mise à jour des stocks en temps réel lors des ventes au comptoir. Conçu avec une attention particulière à la haute performance.',
				visitWebsite: 'Visiter le Site',
				imageSrc: '/www.jualkamera.com.png',
				url: 'https://jualkamera.com'
			},
			{
				id: 'annorakreasi',
				category: 'Plateforme de Formation RH & Entreprise',
				projectName: 'Site Web Annora Cipta Kreasi',
				description:
					"Plateforme institutionnelle et de formation RH (soft skills, prise de parole en public, services psychologiques, renforcement des capacités). Dotée d'un calendrier de sessions, d'un blog dynamique et de formulaires d'inscription interactifs performants.",
				visitWebsite: 'Visiter le Site',
				imageSrc: '/www.annorakreasi.com.png',
				url: 'https://www.annorakreasi.com'
			}
		]
	},
	cta: {
		title: 'Collaborons Ensemble',
		description:
			"Intéressé par la création d'une plateforme robuste ou vous avez un projet à concrétiser ? Planifions un court échange.",
		button: 'Me Contacter'
	}
};
