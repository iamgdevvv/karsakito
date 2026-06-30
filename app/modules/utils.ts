import { clsx, type ClassValue } from 'clsx';
import dayjsX from 'dayjs';
import 'dayjs/locale/id';
import dayjsLocalizedFormat from 'dayjs/plugin/localizedFormat';
import dayjsTimezone from 'dayjs/plugin/timezone';
import dayjsUTC from 'dayjs/plugin/utc';
import * as qs from 'qs-esm';
import { twMerge } from 'tailwind-merge';

dayjsX.extend(dayjsUTC);
dayjsX.extend(dayjsTimezone);
dayjsX.extend(dayjsLocalizedFormat);
dayjsX.locale('id');

export function cn(...inputs: ClassValue[]) {
	return twMerge(clsx(inputs));
}

export function dayjs(date?: dayjsX.ConfigType, timezone?: number) {
	return dayjsX(date)
		.startOf('day')
		.utcOffset(timezone || 7, true);
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

export function toSearchParams<T extends Record<string, unknown>>(
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
