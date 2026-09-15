import Color from 'color';

import type { ThemeShades } from '$lib/types';

const TINT_FACTORS: Record<string, number> = {
	'50': 0.95,
	'100': 0.9,
	'200': 0.75,
	'300': 0.6,
	'400': 0.3
};

const SHADE_FACTORS: Record<string, number> = {
	'600': 0.12,
	'700': 0.28,
	'800': 0.45,
	'900': 0.62,
	'950': 0.78
};

export function generateColorShades(hex: string): ThemeShades | null {
	try {
		const base = Color(hex);
		const white = Color('#ffffff');
		const black = Color('#000000');

		const shades: ThemeShades = {};

		for (const [shade, weight] of Object.entries(TINT_FACTORS)) {
			shades[shade] = base.mix(white, weight).hex().toLowerCase();
		}

		shades['500'] = base.hex().toLowerCase();

		for (const [shade, weight] of Object.entries(SHADE_FACTORS)) {
			shades[shade] = base.mix(black, weight).hex().toLowerCase();
		}

		return shades;
	} catch {
		return null;
	}
}
