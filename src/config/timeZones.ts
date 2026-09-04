export const localTimeZoneId = 'local';

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
] as const;

export type TimeZoneId = (typeof timeZoneOptions)[number]['code'];

export const defaultTimeZoneId: TimeZoneId = 'Europe/Prague';

export const isTimeZoneId = (value: unknown): value is TimeZoneId => timeZoneOptions.some(({ code }) => code === value);
