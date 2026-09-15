import type { HomeTranslation } from './types';

export const zh: HomeTranslation = {
	metaTitle: 'Aan Refarwan | 全栈 TypeScript 开发者与软件工程师',
	metaDescription:
		'专注于现代 JavaScript 与 TypeScript 架构的全栈开发者。构建端到端 Web 应用，并具备 PHP 等后端技术栈的适应经验。',
	hero: {
		role: '全栈 JavaScript 开发者',
		description:
			'热衷于构建前后端兼备的高品质网站与 Web 应用程序。现居日惹，致力于提供高质量的数字化解决方案。',
		viewProjects: '查看项目'
	},
	about: {
		title: '关于我',
		bio1: '我毕业于 SMK N 1 Bantul 软件工程专业。毕业后自学 Web 编程，对构建现代化用户界面和高可用后端系统充满热情。',
		bio2: '紧跟最新的 JavaScript 生态系统动态，乐于通过整洁、结构良好的代码解决复杂的工程问题。',
		experienceTitle: '工作经历',
		experiences: [
			{
				role: 'Web 程序员',
				company: 'PT Fresh Galang Mandiri',
				period: '2022年8月 - 2023年3月'
			},
			{
				role: 'IT 支持与程序员',
				company: 'Toko Kamera Mbantul',
				period: '2017年6月 - 2022年7月'
			}
		]
	},
	skills: {
		title: '编程技能',
		description: '我常用于实现响应迅速、稳定可靠的应用程序设计的技术和工具。'
	},
	projects: {
		title: '精选项目',
		subtitle: '展现我在数据管理、复杂状态处理及响应式界面设计方面的代表作品。',
		items: [
			{
				id: 'jualkamera',
				category: '全栈电商系统',
				projectName: 'Jualkamera.com 网站',
				description:
					'Mbantul 相机店的目录网站，配备 POS（收银终端）功能，收银台录入交易时实时自动同步库存。采用现代技术栈打造，专注于高性能与复杂状态管理。',
				visitWebsite: '访问网站',
				imageSrc: '/www.jualkamera.com.png',
				url: 'https://jualkamera.com'
			},
			{
				id: 'annorakreasi',
				category: '企业培训与人力资源平台',
				projectName: 'Annora Cipta Kreasi 网站',
				description:
					'企业门户与人力资源培训平台（涵盖软技能、公众演讲、心理服务及团队建设）。提供培训课程排期系统、动态博客文章以及高性能互动报名功能。',
				visitWebsite: '访问网站',
				imageSrc: '/www.annorakreasi.com.png',
				url: 'https://www.annorakreasi.com'
			}
		]
	},
	cta: {
		title: '携手合作',
		description: '想要打造稳定可靠的数字化平台，或有精彩项目想一同实现？欢迎随时与我联系沟通。',
		button: '取得联系'
	}
};
