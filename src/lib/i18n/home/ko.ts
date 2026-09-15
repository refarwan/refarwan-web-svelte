import type { HomeTranslation } from './types';

export const ko: HomeTranslation = {
	metaTitle: 'Aan Refarwan | 풀스택 TypeScript 개발자 & 소프트웨어 엔지니어',
	metaDescription:
		'모던 JavaScript 및 TypeScript 아키텍처 전문 풀스택 개발자. PHP 등 백엔드 스택 경험을 바탕으로 엔드투엔드 웹 애플리케이션을 구축합니다.',
	hero: {
		role: '풀스택 자바스크립트 개발자',
		description:
			'열정을 다해 프론트엔드부터 백엔드까지 웹 애플리케이션을 개발합니다. 인도네시아 족자카르타를 기반으로 수준 높은 디지털 솔루션을 제공합니다.',
		viewProjects: '프로젝트 보기'
	},
	about: {
		title: '소개',
		bio1: 'SMK N 1 Bantul 소프트웨어 공학과를 졸업한 후 독학으로 웹 프로그래밍 역량을 쌓았습니다. 모던 사용자 인터페이스와 안정적인 백엔드 시스템 구축에 깊은 열정을 가지고 있습니다.',
		bio2: '항상 최신 자바스크립트 생태계를 주시하며 깔끔하고 구조화된 코드로 복잡한 문제를 해결하는 것을 즐깁니다.',
		experienceTitle: '경력 사항',
		experiences: [
			{
				role: '웹 프로그래머',
				company: 'PT Fresh Galang Mandiri',
				period: '2022년 8월 - 2023년 3월'
			},
			{
				role: 'IT 지원 및 프로그래머',
				company: 'Toko Kamera Mbantul',
				period: '2017년 6월 - 2022년 7월'
			}
		]
	},
	skills: {
		title: '프로그래밍 기술',
		description:
			'반응형이며 안정적인 애플리케이션 설계를 완성하기 위해 자주 사용하는 기술과 개발 도구입니다.'
	},
	projects: {
		title: '대표 프로젝트',
		subtitle:
			'데이터 처리, 복합적인 상태 관리 및 반응형 인터페이스 구현 역량을 담은 대표 작업물입니다.',
		items: [
			{
				id: 'jualkamera',
				category: '풀스택 이커머스',
				projectName: 'Jualkamera.com 웹사이트',
				description:
					'POS(판매 시점 관리) 연동 기능이 포함된 카메라 매장 카탈로그 웹사이트로, 결제 시 재고가 실시간 자동 반영됩니다. 모던 기술 스택을 활용하여 높은 성능과 복합 상태 관리를 구현했습니다.',
				visitWebsite: '웹사이트 방문',
				imageSrc: '/www.jualkamera.com.png',
				url: 'https://jualkamera.com'
			},
			{
				id: 'annorakreasi',
				category: '기업 교육 및 HR 역량강화 플랫폼',
				projectName: 'Annora Cipta Kreasi 웹사이트',
				description:
					'기업 프로필 및 HR 역량 개발 교육 플랫폼(소프트 스킬, 대중 연설, 심리 서비스, 팀 역량 강화). 교육 일정 관리 시스템, 동적 블로그/아티클, 고성능 대화형 수강 신청 폼을 갖추고 있습니다.',
				visitWebsite: '웹사이트 방문',
				imageSrc: '/www.annorakreasi.com.png',
				url: 'https://www.annorakreasi.com'
			}
		]
	},
	cta: {
		title: '함께 프로젝트를 시작해보세요',
		description:
			'안정적인 플랫폼을 구축하거나 함께 구현하고 싶은 프로젝트가 있으신가요? 편하게 대화를 나누어 보세요.',
		button: '연락하기'
	}
};
