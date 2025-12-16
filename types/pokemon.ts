// Simplified Pokemon structure for our app
export interface Pokemon {
  id: number;
  name: string;
  sprite: string;
  types: string[];
  hp: number;
  attack: number;
  defense: number;
  specialAttack: number;
  specialDefense: number;
  speed: number;
  height?: number;
  weight?: number;
  abilities?: string[];
  // Dynamic custom columns
  [key: string]: any;
}

// Raw API response from PokeAPI
export interface PokeApiPokemon {
  id: number;
  name: string;
  sprites: {
    front_default: string;
    other?: {
      'official-artwork'?: {
        front_default: string;
      };
    };
  };
  types: Array<{
    slot: number;
    type: {
      name: string;
      url: string;
    };
  }>;
  stats: Array<{
    base_stat: number;
    effort: number;
    stat: {
      name: string;
      url: string;
    };
  }>;
  height: number;
  weight: number;
  abilities: Array<{
    ability: {
      name: string;
      url: string;
    };
    is_hidden: boolean;
  }>;
}

// Type for Pokemon stat names
export type PokemonStat =
  | 'hp'
  | 'attack'
  | 'defense'
  | 'special-attack'
  | 'special-defense'
  | 'speed';

// Map of stat names from API to our field names
export const STAT_NAME_MAP: Record<string, keyof Pokemon> = {
  'hp': 'hp',
  'attack': 'attack',
  'defense': 'defense',
  'special-attack': 'specialAttack',
  'special-defense': 'specialDefense',
  'speed': 'speed',
};

// Pokemon type colors for UI (optional, for styling)
export const TYPE_COLORS: Record<string, string> = {
  normal: '#A8A878',
  fire: '#F08030',
  water: '#6890F0',
  electric: '#F8D030',
  grass: '#78C850',
  ice: '#98D8D8',
  fighting: '#C03028',
  poison: '#A040A0',
  ground: '#E0C068',
  flying: '#A890F0',
  psychic: '#F85888',
  bug: '#A8B820',
  rock: '#B8A038',
  ghost: '#705898',
  dragon: '#7038F8',
  dark: '#705848',
  steel: '#B8B8D0',
  fairy: '#EE99AC',
};

// Function to transform API data to our Pokemon structure
export function transformApiPokemon(apiPokemon: PokeApiPokemon): Pokemon {
  const stats: Record<string, number> = {};
  
  apiPokemon.stats.forEach((stat) => {
    const mappedName = STAT_NAME_MAP[stat.stat.name];
    if (mappedName) {
      stats[mappedName] = stat.base_stat;
    }
  });

  return {
    id: apiPokemon.id,
    name: apiPokemon.name.charAt(0).toUpperCase() + apiPokemon.name.slice(1),
    sprite: apiPokemon.sprites.other?.['official-artwork']?.front_default || 
            apiPokemon.sprites.front_default,
    types: apiPokemon.types.map((t) => t.type.name),
    hp: stats.hp || 0,
    attack: stats.attack || 0,
    defense: stats.defense || 0,
    specialAttack: stats.specialAttack || 0,
    specialDefense: stats.specialDefense || 0,
    speed: stats.speed || 0,
    height: apiPokemon.height,
    weight: apiPokemon.weight,
    abilities: apiPokemon.abilities.map((a) => a.ability.name),
  };
}