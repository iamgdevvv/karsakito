import { clsx, type ClassValue } from 'clsx';
import dayjsX from 'dayjs';
import 'dayjs/locale/id';
import dayjsLocalizedFormat from 'dayjs/plugin/localizedFormat';
import dayjsRelativeTime from 'dayjs/plugin/relativeTime';
import dayjsTimezone from 'dayjs/plugin/timezone';
import dayjsUTC from 'dayjs/plugin/utc';
import * as qs from 'qs-esm';
import { twMerge } from 'tailwind-merge';

dayjsX.extend(dayjsUTC);
dayjsX.extend(dayjsTimezone);
dayjsX.extend(dayjsLocalizedFormat);
dayjsX.extend(dayjsRelativeTime);
dayjsX.locale('id');

export function cn(...inputs: ClassValue[]) {
	return twMerge(clsx(inputs));
}

export function slugify(str: string) {
	return str
		.normalize('NFD')
		.replace(/[\u0300-\u036f]/g, '')
		.replace(/^\s+|\s+$/g, '')
		.toLowerCase()
		.replace(/[^a-z0-9 -]/g, '')
		.replace(/\s+/g, '-')
		.replace(/-+/g, '-');
}

export const valueBooleanOrFalse = (value?: boolean | null | undefined): boolean => {
	return value ?? false;
};

export function dayjs(date?: dayjsX.ConfigType, timezone?: number | string) {
	return dayjsX(date).utcOffset(timezone || 7, true);
}

export function qsParse(payload: string) {
	return qs.parse(decodeURIComponent(payload), {
		ignoreQueryPrefix: true,
		comma: true,
		decoder(str, defaultDecoder) {
			const value = defaultDecoder(str, defaultDecoder);

			if (value === '') {
				return undefined;
			}

			return value;
		},
	});
}

export function toPayloadSearchParams<T extends Record<string, unknown>>(
	value: T,
): Record<string, string | string[]> {
	return Object.fromEntries(
		Object.entries(value)
			.filter(([, v]) => v != null)
			.map(([k, v]) => {
				let parsedValue: string | string[];

				if (v instanceof Date) {
					parsedValue = v.toISOString();
				} else if (Array.isArray(v)) {
					parsedValue = v.map(String);
				} else if (typeof v === 'object') {
					parsedValue = JSON.stringify(v);
				} else {
					parsedValue = String(v);
				}

				return [k, parsedValue];
			}),
	);
}

export function queryParamsToString(payload: URLSearchParams) {
	if (payload.size === 0) {
		return '';
	}

	return `?${payload.toString()}`;
}

export function parseFormData(formData: FormData) {
	const parseData = Object.fromEntries(formData) as Record<string, unknown>;

	Object.entries(parseData).forEach(([key, value]) => {
		if (value === 'true') {
			parseData[key] = true;
		} else if (value === 'false') {
			parseData[key] = false;
		} else if (value === 'null') {
			parseData[key] = null;
		} else if (value === 'undefined') {
			parseData[key] = undefined;
		} else if (value === 'NaN') {
			parseData[key] = undefined;
		} else if (value === 'Infinity') {
			parseData[key] = undefined;
		} else if (value === '-Infinity') {
			parseData[key] = undefined;
		} else if (value === '') {
			parseData[key] = null;
		}
	});

	return parseData;
}

export function findActiveNavigation(
	navs: {
		value: string;
	}[],
	currentPath: string,
) {
	const matchNavs = navs.filter(
		(item) => currentPath === item.value || currentPath.startsWith(`${item.value}/`),
	);

	if (matchNavs.length) {
		matchNavs.sort((a, b) => b.value.length - a.value.length);

		return matchNavs[0];
	}

	return undefined;
}

export function getYoutubeId(url: string) {
	try {
		const parsed = new URL(url, 'https://www.youtube.com');

		if (parsed.hostname.includes('youtu.be')) {
			return parsed.pathname.slice(1);
		}

		if (parsed.searchParams.has('v')) {
			return parsed.searchParams.get('v');
		}

		const match = parsed.pathname.match(/\/(?:embed|shorts|live)\/([^/?]+)/);

		if (match && match[1]) {
			return match[1];
		}
	} catch {
		return undefined;
	}
}

export function displayPrice(price: number) {
	return new Intl.NumberFormat('id-ID', {
		style: 'currency',
		currency: 'IDR',
		minimumFractionDigits: 0,
	}).format(price);
}
