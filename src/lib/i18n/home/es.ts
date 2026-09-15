import type { HomeTranslation } from './types';

export const es: HomeTranslation = {
	metaTitle: 'Aan Refarwan | Desarrollador Fullstack TypeScript e Ingeniero de Software',
	metaDescription:
		'Desarrollador Fullstack especializado en arquitecturas modernas de JavaScript y TypeScript. Creando aplicaciones web completas con experiencia adaptable en backend.',
	hero: {
		role: 'Desarrollador Fullstack JavaScript',
		description:
			'Creo sitios y aplicaciones web tanto en frontend como en backend con pasión. Basado en Yogyakarta con gran entusiasmo para ofrecer soluciones digitales de alta calidad.',
		viewProjects: 'Ver Proyectos'
	},
	about: {
		title: 'Sobre Mí',
		bio1: 'Me gradué de SMK N 1 Bantul con especialización en Ingeniería de Software. Tras graduarme, continué mi aprendizaje autodidacta. Tengo una gran pasión por construir interfaces modernas y sistemas backend robustos.',
		bio2: 'Siempre al día con el ecosistema moderno de JavaScript y disfrutando de resolver problemas complejos con código limpio y estructurado.',
		experienceTitle: 'Experiencia Laboral',
		experiences: [
			{
				role: 'Programador Web',
				company: 'PT Fresh Galang Mandiri',
				period: 'Agosto 2022 - Marzo 2023'
			},
			{
				role: 'Soporte IT y Programador',
				company: 'Toko Kamera Mbantul',
				period: 'Junio 2017 - Julio 2022'
			}
		]
	},
	skills: {
		title: 'Habilidades Técnicas',
		description:
			'Tecnologías y herramientas que utilizo con frecuencia para dar vida a aplicaciones robustas y responsivas.'
	},
	projects: {
		title: 'Proyectos Destacados',
		subtitle:
			'Trabajo seleccionado que representa mi experiencia en gestión de datos, estados complejos e interfaces adaptables.',
		items: [
			{
				id: 'jualkamera',
				category: 'E-Commerce Fullstack',
				projectName: 'Sitio Web Jualkamera.com',
				description:
					'Sitio web de catálogo para la tienda Mbantul Camera con funcionalidad POS (Punto de Venta), garantizando actualizaciones de stock en tiempo real en cada transacción. Construido con enfoque en alto rendimiento y gestión de estado con un stack moderno.',
				visitWebsite: 'Visitar Sitio Web',
				imageSrc: '/www.jualkamera.com.png',
				url: 'https://jualkamera.com'
			},
			{
				id: 'annorakreasi',
				category: 'Plataforma de Capacitación y RRHH',
				projectName: 'Sitio Web Annora Cipta Kreasi',
				description:
					'Plataforma corporativa y de capacitación de recursos humanos (habilidades blandas, oratoria, servicios de psicología y desarrollo de capacidades). Cuenta con calendario de cursos, blog dinámico y formularios de inscripción interactivos de alto rendimiento.',
				visitWebsite: 'Visitar Sitio Web',
				imageSrc: '/www.annorakreasi.com.png',
				url: 'https://www.annorakreasi.com'
			}
		]
	},
	cta: {
		title: 'Trabajemos Juntos',
		description:
			'¿Interesado en crear una plataforma confiable o tienes un proyecto que deseas hacer realidad? Charlemos un momento.',
		button: 'Ponte en Contacto'
	}
};
