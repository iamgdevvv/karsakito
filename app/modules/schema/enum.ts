import * as z from 'zod';

export const TimezoneSchema = z.enum([
	'Pacific/Midway', // UTC-11
	'Pacific/Honolulu', // UTC-10
	'America/Anchorage', // UTC-9
	'America/Los_Angeles', // UTC-8
	'America/Denver', // UTC-7
	'America/Chicago', // UTC-6
	'America/New_York', // UTC-5
	'America/Caracas', // UTC-4
	'America/St_Johns', // UTC-3:30
	'America/Sao_Paulo', // UTC-3
	'Atlantic/South_Georgia', // UTC-2
	'Atlantic/Azores', // UTC-1
	'UTC', // UTC±0
	'Europe/Berlin', // UTC+1
	'Africa/Cairo', // UTC+2
	'Asia/Riyadh', // UTC+3
	'Asia/Tehran', // UTC+3:30
	'Asia/Dubai', // UTC+4
	'Asia/Kabul', // UTC+4:30
	'Asia/Karachi', // UTC+5
	'Asia/Kolkata', // UTC+5:30
	'Asia/Kathmandu', // UTC+5:45
	'Asia/Dhaka', // UTC+6
	'Asia/Yangon', // UTC+6:30
	'Asia/Jakarta', // UTC+7
	'Asia/Makassar', // UTC+8
	'Asia/Jayapura', // UTC+9
	'Asia/Hong_Kong', // UTC+8
	'Asia/Tokyo', // UTC+9
	'Australia/Adelaide', // UTC+9:30
	'Australia/Sydney', // UTC+10
	'Australia/Lord_Howe', // UTC+10:30
	'Pacific/Noumea', // UTC+11
	'Pacific/Auckland', // UTC+12
	'Pacific/Chatham', // UTC+12:45
	'Pacific/Tongatapu', // UTC+13
]);

export type TimezoneEnum = z.infer<typeof TimezoneSchema>;
