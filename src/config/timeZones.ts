/** Sentinel value that makes formatters use the browser's local timezone. */
export const localTimeZoneId = 'local' as const;

/** Shared shape of an entry in the timezone picker. */
type TimeZoneOption = {
	code: string;
	name: string;
	utc: string | null;
};

/** Ordered timezone choices displayed from UTC−12 through UTC+14. */
export const timeZoneOptions = [
	{ code: localTimeZoneId, name: 'Lokální čas', utc: null },
	{ code: 'Etc/GMT+12', name: 'Bakerův ostrov (Pacifik)', utc: '-12:00' },
	{ code: 'Pacific/Niue', name: 'Niue (Pacifik)', utc: '-11:00' },
	{ code: 'US/Hawaii', name: 'Havaj (Spojené státy)', utc: '-10:00' },
	{
		code: 'Pacific/Marquesas',
		name: 'Markézy (Francouzská Polynésie)',
		utc: '-09:30',
	},
	{ code: 'US/Alaska', name: 'Aljaška (Spojené státy)', utc: '-09:00' },
	{
		code: 'America/Los_Angeles',
		name: 'Los Angeles (Spojené státy) / Vancouver (Kanada) / Tijuana (Mexiko)',
		utc: '-08:00',
	},
	{
		code: 'America/Denver',
		name: 'Denver (Spojené státy) / Calgary (Kanada) / Ciudad Juárez (Mexiko)',
		utc: '-07:00',
	},
	{
		code: 'America/Chicago',
		name: 'Chicago (Spojené státy) / Winnipeg (Kanada) / San José (Kostarika)',
		utc: '-06:00',
	},
	{
		code: 'America/New_York',
		name: 'New York (Spojené státy) / Toronto (Kanada) / Havana (Kuba)',
		utc: '-05:00',
	},
	{
		code: 'America/Santiago',
		name: 'Santiago (Chile) / Santo Domingo (Dominikánská republika) / Manaus (Brazílie)',
		utc: '-04:00',
	},
	{
		code: 'Canada/Newfoundland',
		name: 'Newfoundland a Labrador (Kanada)',
		utc: '-03:30',
	},
	{
		code: 'America/Sao_Paulo',
		name: 'São Paulo (Brazílie) / Buenos Aires (Argentina) / Montevideo (Uruguay)',
		utc: '-03:00',
	},
	{
		code: 'Atlantic/South_Georgia',
		name: 'Jižní Georgie a Jižní Sandwichovy ostrovy (Atlantický oceán)',
		utc: '-02:00',
	},
	{
		code: 'Atlantic/Cape_Verde',
		name: 'Kapverdy (Atlantický oceán)',
		utc: '-01:00',
	},
	{
		code: 'Europe/London',
		name: 'Londýn (Spojené království) / Dublin (Irsko) / Lisabon (Portugalsko)',
		utc: '+00:00',
	},
	{
		code: 'Europe/Prague',
		name: 'Praha (Česko) / Berlín (Německo) / Řím (Itálie)',
		utc: '+01:00',
	},
	{
		code: 'Europe/Athens',
		name: 'Athény (Řecko) / Helsinky (Finsko) / Kyjev (Ukrajina)',
		utc: '+02:00',
	},
	{
		code: 'Europe/Moscow',
		name: 'Moskva (Rusko) / Istanbul (Turecko) / Rijád (Saudská Arábie)',
		utc: '+03:00',
	},
	{ code: 'Asia/Tehran', name: 'Teherán (Írán)', utc: '+03:30' },
	{
		code: 'Asia/Dubai',
		name: 'Dubaj (Spojené arabské emiráty)',
		utc: '+04:00',
	},
	{ code: 'Asia/Kabul', name: 'Kábul (Afghánistán)', utc: '+04:30' },
	{
		code: 'Asia/Karachi',
		name: 'Karáčí (Pákistán) / Maledivy (Indický oceán)',
		utc: '+05:00',
	},
	{
		code: 'Asia/Colombo',
		name: 'Nové Dillí (Indie) / Kolombo (Srí Lanka)',
		utc: '+05:30',
	},
	{ code: 'Asia/Kathmandu', name: 'Káthmándú (Nepál)', utc: '+05:45' },
	{
		code: 'Asia/Dhaka',
		name: 'Dháka (Bangladéš) / Omsk (Rusko)',
		utc: '+06:00',
	},
	{ code: 'Asia/Yangon', name: 'Yankoun (Myanmar)', utc: '+06:30' },
	{
		code: 'Asia/Jakarta',
		name: 'Jakarta (Indonésie) / Bangkok (Thajsko)',
		utc: '+07:00',
	},
	{ code: 'Asia/Shanghai', name: 'Šanghaj (Čína) / Singapur', utc: '+08:00' },
	{ code: 'Australia/Eucla', name: 'Eucla (Austrálie)', utc: '+08:45' },
	{
		code: 'Asia/Tokyo',
		name: 'Tokio (Japonsko) / Soul (Jižní Korea)',
		utc: '+09:00',
	},
	{ code: 'Australia/Adelaide', name: 'Adelaide (Austrálie)', utc: '+09:30' },
	{
		code: 'Australia/Sydney',
		name: 'Sydney (Austrálie) / Vladivostok (Rusko)',
		utc: '+10:00',
	},
	{
		code: 'Australia/Lord_Howe',
		name: 'Ostrov Lorda Howa (Pacifik)',
		utc: '+10:30',
	},
	{ code: 'Pacific/Noumea', name: 'Nouméa (Pacifik)', utc: '+11:00' },
	{ code: 'Pacific/Auckland', name: 'Auckland (Nový Zéland)', utc: '+12:00' },
	{
		code: 'Pacific/Chatham',
		name: 'Chathamské ostrovy (Pacifik)',
		utc: '+12:45',
	},
	{
		code: 'Pacific/Samoa',
		name: 'Samoa / Phoenixské ostrovy (Pacifik)',
		utc: '+13:00',
	},
	{ code: 'Pacific/Kiritimati', name: 'Kiritimati (Pacifik)', utc: '+14:00' },
] as const satisfies readonly TimeZoneOption[];

/** Identifier persisted for the selected timezone. */
export type TimeZoneId = (typeof timeZoneOptions)[number]['code'];

/** English labels corresponding to the Czech timezone definitions. */
export const timeZoneNamesEn: Readonly<Record<TimeZoneId, string>> = {
	local: 'Local time',
	'Etc/GMT+12': 'Baker Island (Pacific)',
	'Pacific/Niue': 'Niue (Pacific)',
	'US/Hawaii': 'Hawaii (United States)',
	'Pacific/Marquesas': 'Marquesas Islands (French Polynesia)',
	'US/Alaska': 'Alaska (United States)',
	'America/Los_Angeles':
		'Los Angeles (United States) / Vancouver (Canada) / Tijuana (Mexico)',
	'America/Denver':
		'Denver (United States) / Calgary (Canada) / Ciudad Juárez (Mexico)',
	'America/Chicago':
		'Chicago (United States) / Winnipeg (Canada) / San José (Costa Rica)',
	'America/New_York':
		'New York (United States) / Toronto (Canada) / Havana (Cuba)',
	'America/Santiago':
		'Santiago (Chile) / Santo Domingo (Dominican Republic) / Manaus (Brazil)',
	'Canada/Newfoundland': 'Newfoundland and Labrador (Canada)',
	'America/Sao_Paulo':
		'São Paulo (Brazil) / Buenos Aires (Argentina) / Montevideo (Uruguay)',
	'Atlantic/South_Georgia':
		'South Georgia and South Sandwich Islands (Atlantic Ocean)',
	'Atlantic/Cape_Verde': 'Cape Verde (Atlantic Ocean)',
	'Europe/London':
		'London (United Kingdom) / Dublin (Ireland) / Lisbon (Portugal)',
	'Europe/Prague':
		'Prague (Czech Republic) / Berlin (Germany) / Rome (Italy)',
	'Europe/Athens':
		'Athens (Greece) / Helsinki (Finland) / Kyiv (Ukraine)',
	'Europe/Moscow':
		'Moscow (Russia) / Istanbul (Turkey) / Riyadh (Saudi Arabia)',
	'Asia/Tehran': 'Tehran (Iran)',
	'Asia/Dubai': 'Dubai (United Arab Emirates)',
	'Asia/Kabul': 'Kabul (Afghanistan)',
	'Asia/Karachi': 'Karachi (Pakistan) / Maldives (Indian Ocean)',
	'Asia/Colombo': 'New Delhi (India) / Colombo (Sri Lanka)',
	'Asia/Kathmandu': 'Kathmandu (Nepal)',
	'Asia/Dhaka': 'Dhaka (Bangladesh) / Omsk (Russia)',
	'Asia/Yangon': 'Yangon (Myanmar)',
	'Asia/Jakarta': 'Jakarta (Indonesia) / Bangkok (Thailand)',
	'Asia/Shanghai': 'Shanghai (China) / Singapore',
	'Australia/Eucla': 'Eucla (Australia)',
	'Asia/Tokyo': 'Tokyo (Japan) / Seoul (South Korea)',
	'Australia/Adelaide': 'Adelaide (Australia)',
	'Australia/Sydney': 'Sydney (Australia) / Vladivostok (Russia)',
	'Australia/Lord_Howe': 'Lord Howe Island (Pacific)',
	'Pacific/Noumea': 'Nouméa (Pacific)',
	'Pacific/Auckland': 'Auckland (New Zealand)',
	'Pacific/Chatham': 'Chatham Islands (Pacific)',
	'Pacific/Samoa': 'Samoa / Phoenix Islands (Pacific)',
	'Pacific/Kiritimati': 'Kiritimati (Pacific)',
};

/** Timezone used when no valid saved preference exists. */
export const defaultTimeZoneId: TimeZoneId = 'Europe/Prague';

/** Checks unknown persisted data before treating it as a timezone ID. */
export const isTimeZoneId = (value: unknown): value is TimeZoneId =>
	timeZoneOptions.some(({ code }) => code === value);
