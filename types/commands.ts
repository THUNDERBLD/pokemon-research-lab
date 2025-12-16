import { Pokemon } from './pokemon';

// Command types supported by the chat assistant
export type CommandType = 
  | 'set'        // set hp to 100 for all pokemon of type 'grass'
  | 'update'     // update ability to 'levitate' where name is 'gengar'
  | 'delete'     // delete rows where generation is 1
  | 'add'        // add column named 'generation' of type number
  | 'filter'     // filter pokemon where speed > 100
  | 'unknown';   // unrecognized command

// Parsed command structure
export interface ParsedCommand {
  type: CommandType;
  action?: string;
  field?: string;
  value?: any;
  condition?: CommandCondition;
  columnName?: string;
  columnType?: 'text' | 'number' | 'boolean';
  error?: string;
}

// Condition for filtering/updating
export interface CommandCondition {
  field: string;
  operator: 'equals' | 'notEquals' | 'greaterThan' | 'lessThan' | 'contains' | 'in';
  value: any;
}

// Command execution result
export interface CommandResult {
  success: boolean;
  message: string;
  affectedCount?: number;
  error?: string;
}

// Command patterns for regex matching
export const COMMAND_PATTERNS = {
  // set [field] to [value] for all pokemon of type '[type]'
  // set [field] to [value] where [condition]
  SET: /^set\s+(\w+)\s+to\s+(.+?)\s+(?:for\s+all\s+pokemon\s+of\s+type\s+['"]?(\w+)['"]?|where\s+(.+))$/i,
  
  // update [field] to [value] where [condition]
  UPDATE: /^update\s+(\w+)\s+to\s+(.+?)\s+where\s+(.+)$/i,
  
  // delete rows where [condition]
  DELETE: /^delete\s+rows\s+where\s+(.+)$/i,
  
  // add column [name] of type [type]
  ADD_COLUMN: /^add\s+column\s+(?:named\s+)?['"]?(\w+)['"]?\s+of\s+type\s+(\w+)$/i,
};

// Helper to parse conditions like "name is 'gengar'" or "speed > 100"
export function parseCondition(conditionStr: string): CommandCondition | null {
  // Pattern: field operator value
  // Examples: "name is 'gengar'", "speed > 100", "type contains 'fire'"
  
  // Remove quotes from value
  const cleanCondition = conditionStr.trim();
  
  // Check for different operators
  if (cleanCondition.includes(' is ')) {
    const [field, value] = cleanCondition.split(' is ').map((s) => s.trim());
    return {
      field: field.toLowerCase(),
      operator: 'equals',
      value: value.replace(/['"]/g, ''),
    };
  }
  
  if (cleanCondition.includes(' = ')) {
    const [field, value] = cleanCondition.split(' = ').map((s) => s.trim());
    return {
      field: field.toLowerCase(),
      operator: 'equals',
      value: value.replace(/['"]/g, ''),
    };
  }
  
  if (cleanCondition.includes(' > ')) {
    const [field, value] = cleanCondition.split(' > ').map((s) => s.trim());
    return {
      field: field.toLowerCase(),
      operator: 'greaterThan',
      value: Number(value),
    };
  }
  
  if (cleanCondition.includes(' < ')) {
    const [field, value] = cleanCondition.split(' < ').map((s) => s.trim());
    return {
      field: field.toLowerCase(),
      operator: 'lessThan',
      value: Number(value),
    };
  }
  
  if (cleanCondition.includes(' contains ')) {
    const [field, value] = cleanCondition.split(' contains ').map((s) => s.trim());
    return {
      field: field.toLowerCase(),
      operator: 'contains',
      value: value.replace(/['"]/g, ''),
    };
  }
  
  return null;
}

// Helper to check if a pokemon matches a condition
export function matchesCondition(pokemon: Pokemon, condition: CommandCondition): boolean {
  const fieldValue = pokemon[condition.field];
  
  switch (condition.operator) {
    case 'equals':
      if (Array.isArray(fieldValue)) {
        return fieldValue.some((v) => 
          String(v).toLowerCase() === String(condition.value).toLowerCase()
        );
      }
      return String(fieldValue).toLowerCase() === String(condition.value).toLowerCase();
    
    case 'notEquals':
      return fieldValue !== condition.value;
    
    case 'greaterThan':
      return Number(fieldValue) > Number(condition.value);
    
    case 'lessThan':
      return Number(fieldValue) < Number(condition.value);
    
    case 'contains':
      if (Array.isArray(fieldValue)) {
        return fieldValue.some((v) =>
          String(v).toLowerCase().includes(String(condition.value).toLowerCase())
        );
      }
      return String(fieldValue).toLowerCase().includes(String(condition.value).toLowerCase());
    
    default:
      return false;
  }
}

// Example commands for user help
export const EXAMPLE_COMMANDS = [
  "set hp to 100 for all pokemon of type 'grass'",
  "update attack to 150 where name is 'pikachu'",
  "delete rows where speed < 50",
  "set defense to 200 where hp > 100",
  "add column named 'generation' of type number",
];