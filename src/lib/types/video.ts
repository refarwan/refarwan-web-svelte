export type VideoStatus = 'published' | 'draft' | 'archived';

export interface VideoUploader {
	id: string;
	fullname: string;
}

export interface VideoTranslationItem {
	id: string;
	videoId: string;
	languageCode: string;
	title: string;
	description: string;
	createdAt: string;
	updatedAt: string;
}

export interface VideoItem {
	id: string;
	title: string | null;
	status: VideoStatus;
	category: string | null;
	thumbnail: { small: string; medium: string; large: string } | null;
	viewsCount: number;
	createdAt: string;
}

export interface VideoDetail extends VideoItem {
	description: string | null;
	duration: number;
	categoryId: string | null;
	uploader: VideoUploader | null;
	p360: string | null;
	p720: string | null;
	p1080: string | null;
	translations: VideoTranslationItem[];
	updatedAt: string;
}
