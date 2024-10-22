type DebugInfo = {
	ping: boolean;
	query: boolean;
	srv: boolean;
	querymismatch: boolean;
	ipinsrv: boolean;
	cnameinsrv: boolean;
	animatedmotd: boolean;
	cachehit: boolean;
	cachetime: number;
	cacheexpire: number;
	apiversion: number;
	error?: {
		query?: string;
		ping?: string;
	};
};

type Player = {
	name: string;
	uuid: string; // UUID format is a string
};

type MinecraftPlugin = {
	name: string;
	version: string;
};

type Mod = {
	name: string;
	version: string;
};

type Motd = {
	raw: string[];
	clean: string[];
	/**
	 * this is sanitised when getting the status, so it's safe to use
	 */
	html: string[];
};

type MapInfo = {
	raw: string;
	clean: string;
	html: string;
};

type Protocol = {
	version: number;
	name?: string; // Optional if not provided
};

type PlayersInfo = {
	online: number;
	max: number;
	list?: Player[]; // Optional if no players are online
};

type OnlineResponse = {
	online: true;
	ip?: string; // Could be empty
	port?: number; // Could be empty
	hostname?: string; // Only included when a hostname is detected
	debug: DebugInfo;
	version: string; // Could include multiple versions or additional text
	protocol?: Protocol; // Only included when ping is used
	icon?: string; // Only included when an icon is detected
	software?: string; // Only included when software is detected
	map: MapInfo;
	gamemode?: string; // Only included for Bedrock servers
	serverid?: string; // Only included for Bedrock servers
	eula_blocked?: boolean; // Only included for Java servers
	motd: Motd;
	players: PlayersInfo;
	plugins?: MinecraftPlugin[]; // Only included when plugins are detected
	mods?: Mod[]; // Only included when mods are detected
	info?: Motd; // Only included when detecting that the player samples are used for information
};

type OfflineResponse = {
	online: false;
	ip?: string; // Could be empty
	port?: number; // Could be empty
	hostname?: string; // Only included when a hostname is detected
	debug: DebugInfo;
};

type ServerStatus = OfflineResponse | OnlineResponse;

export { type ServerStatus, type OnlineResponse };
