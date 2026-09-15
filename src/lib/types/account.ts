import type { AreaItem } from './area';
import type { ImageSource } from './setting';

export type Gender = 'male' | 'female';

export interface AccountItem {
	username: string;
	email: string;
	phoneNumber: string | null;
	fullname: string;
	birthday: string | null;
	gender: Gender | null;
	address: string | null;
	birthplace: AreaItem | null;
	province: AreaItem | null;
	regency: AreaItem | null;
	district: AreaItem | null;
	village: AreaItem | null;
	profilePicture: ImageSource | null;
}
