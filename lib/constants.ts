// PokeAPI Configuration
export const POKEAPI_BASE_URL = 'https://pokeapi.co/api/v2';
export const POKEAPI_POKEMON_ENDPOINT = `${POKEAPI_BASE_URL}/pokemon`;
export const POKEAPI_SPECIES_ENDPOINT = `${POKEAPI_BASE_URL}/pokemon-species`;

// Total Pokemon available (Gen 1-9)
export const TOTAL_POKEMON_COUNT = 1025;   // we can't take more than 1025 because this api only have 1025 pokemons

// API Pagination
export const POKEMON_PER_PAGE = 40;
export const MAX_CONCURRENT_REQUESTS = 10;

// Table Configuration
export const DEFAULT_ROW_HEIGHT = 60;
export const TABLE_OVERSCAN = 10;

// CSV Configuration
export const MAX_CSV_FILE_SIZE = 100 * 1024 * 1024; // 100MB
export const CSV_CHUNK_SIZE = 1000; // Process 1000 rows at a time
export const SUPPORTED_CSV_DELIMITERS = [',', ';', '\t', '|'];

// Default Values
export const DEFAULT_POKEMON_SPRITE = '/placeholder-pokemon.png';
export const DEFAULT_COLUMN_WIDTH = 120;

// UI Messages
export const MESSAGES = {
  FETCH_START: 'Starting to fetch Pokemon data...',
  FETCH_IN_PROGRESS: (current: number, total: number) => 
    `Fetched ${current} / ${total} Pokemon...`,
  FETCH_COMPLETE: (count: number) => 
    `Successfully fetched ${count} Pokemon!`,
  FETCH_ERROR: 'Failed to fetch Pokemon data. Please try again.',
  
  CSV_UPLOAD_START: 'Uploading CSV file...',
  CSV_PARSE_START: 'Parsing CSV file...',
  CSV_PARSE_COMPLETE: (count: number) => 
    `Successfully parsed ${count} rows from CSV!`,
  CSV_PARSE_ERROR: 'Failed to parse CSV file. Please check the format.',
  
  NO_DATA: 'No Pokemon data available. Fetch from API or upload CSV.',
  
  COMMAND_EXECUTED: (count: number) => 
    `Command executed successfully! ${count} Pokemon affected.`,
  COMMAND_ERROR: 'Failed to execute command. Please check the syntax.',
};

// Command Help Examples
export const COMMAND_EXAMPLES = [
  {
    command: "set hp to 100 for all pokemon of type 'grass'",
    description: 'Set HP to 100 for all Grass-type Pokemon',
  },
  {
    command: "update attack to 150 where name is 'pikachu'",
    description: "Update Pikachu's attack to 150",
  },
  {
    command: "delete rows where speed < 50",
    description: 'Delete all Pokemon with speed less than 50',
  },
  {
    command: "set defense to 200 where hp > 100",
    description: 'Set defense to 200 for Pokemon with HP over 100',
  },
  {
    command: "add column named 'generation' of type number",
    description: 'Add a new custom column named generation',
  },
];

// Error Messages
export const ERROR_MESSAGES = {
  NETWORK_ERROR: 'Network error. Please check your connection.',
  API_RATE_LIMIT: 'API rate limit reached. Please wait a moment.',
  FILE_TOO_LARGE: `File size exceeds ${MAX_CSV_FILE_SIZE / 1024 / 1024}MB limit.`,
  INVALID_FILE_TYPE: 'Invalid file type. Please upload a CSV file.',
  PARSE_ERROR: 'Error parsing file. Please check the format.',
  NO_HEADERS: 'CSV file must contain headers.',
  INVALID_MAPPING: 'Invalid column mapping. Please check your selections.',
};

// Local Storage Keys (if you decide to add persistence later)
export const STORAGE_KEYS = {
  POKEMON_DATA: 'pokemon_research_lab_data',
  CUSTOM_COLUMNS: 'pokemon_research_lab_columns',
  USER_PREFERENCES: 'pokemon_research_lab_preferences',
};