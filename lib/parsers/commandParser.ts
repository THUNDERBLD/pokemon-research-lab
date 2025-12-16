import {
  ParsedCommand,
  COMMAND_PATTERNS,
  parseCondition as parseConditionFromTypes,
  matchesCondition as matchesConditionFromTypes,
} from '@/types/commands';


// Main command parser - converts user input to structured command
export function parseCommand(input: string): ParsedCommand {
  const trimmedInput = input.trim().toLowerCase();

  if (!trimmedInput) {
    return {
      type: 'unknown',
      error: 'Please enter a command',
    };
  }

  // Try to match SET pattern
  const setCommand = parseSetCommand(input);
  if (setCommand.type !== 'unknown') return setCommand;

  // Try to match UPDATE pattern
  const updateCommand = parseUpdateCommand(input);
  if (updateCommand.type !== 'unknown') return updateCommand;

  // Try to match DELETE pattern
  const deleteCommand = parseDeleteCommand(input);
  if (deleteCommand.type !== 'unknown') return deleteCommand;

  // Try to match ADD COLUMN pattern
  const addCommand = parseAddColumnCommand(input);
  if (addCommand.type !== 'unknown') return addCommand;

  // No pattern matched
  return {
    type: 'unknown',
    error: 'Command not recognized. Try: "set hp to 100 for all pokemon of type \'grass\'"',
  };
}

/**
 * Parse SET command
 * Examples:
 * - "set hp to 100 for all pokemon of type 'grass'"
 * - "set attack to 150 where speed > 100"
 */
function parseSetCommand(input: string): ParsedCommand {
  const match = input.match(COMMAND_PATTERNS.SET);
  
  if (!match) {
    return { type: 'unknown' };
  }

  const field = match[1].trim();
  let value: any = match[2].trim().replace(/['"]/g, '');
  const type = match[3];
  const conditionStr = match[4];

  // Try to convert value to number if possible
  if (!isNaN(Number(value))) {
    value = Number(value);
  }

  // Handle type-based condition
  if (type) {
    return {
      type: 'set',
      field,
      value,
      condition: {
        field: 'types',
        operator: 'contains',
        value: type,
      },
    };
  }

  // Handle where clause
  if (conditionStr) {
    const condition = parseConditionFromTypes(conditionStr);
    if (!condition) {
      return {
        type: 'unknown',
        error: 'Invalid condition format',
      };
    }
    return {
      type: 'set',
      field,
      value,
      condition,
    };
  }

  return { type: 'unknown' };
}

/**
 * Parse UPDATE command
 * Example: "update ability to 'levitate' where name is 'gengar'"
 */
function parseUpdateCommand(input: string): ParsedCommand {
  const match = input.match(COMMAND_PATTERNS.UPDATE);
  
  if (!match) {
    return { type: 'unknown' };
  }

  const field = match[1].trim();
  let value: any = match[2].trim().replace(/['"]/g, '');
  const conditionStr = match[3].trim();

  // Try to convert value to number if possible
  if (!isNaN(Number(value))) {
    value = Number(value);
  }

  const condition = parseConditionFromTypes(conditionStr);
  if (!condition) {
    return {
      type: 'unknown',
      error: 'Invalid condition format',
    };
  }

  return {
    type: 'update',
    field,
    value,
    condition,
  };
}

/**
 * Parse DELETE command
 * Example: "delete rows where generation is 1"
 */
function parseDeleteCommand(input: string): ParsedCommand {
  const match = input.match(COMMAND_PATTERNS.DELETE);
  
  if (!match) {
    return { type: 'unknown' };
  }

  const conditionStr = match[1].trim();
  const condition = parseConditionFromTypes(conditionStr);

  if (!condition) {
    return {
      type: 'unknown',
      error: 'Invalid condition format',
    };
  }

  return {
    type: 'delete',
    condition,
  };
}

/**
 * Parse ADD COLUMN command
 * Example: "add column named 'generation' of type number"
 */
function parseAddColumnCommand(input: string): ParsedCommand {
  const match = input.match(COMMAND_PATTERNS.ADD_COLUMN);
  
  if (!match) {
    return { type: 'unknown' };
  }

  const columnName = match[1].trim();
  const columnType = match[2].trim().toLowerCase();

  if (!['text', 'number', 'boolean'].includes(columnType)) {
    return {
      type: 'unknown',
      error: `Invalid column type: ${columnType}. Use text, number, or boolean.`,
    };
  }

  return {
    type: 'add',
    columnName,
    columnType: columnType as 'text' | 'number' | 'boolean',
  };
}

/**
 * Validate command before execution
 */
export function validateCommand(command: ParsedCommand): { valid: boolean; error?: string } {
  if (command.type === 'unknown') {
    return { valid: false, error: command.error || 'Unknown command' };
  }

  switch (command.type) {
    case 'set':
    case 'update':
      if (!command.field || command.value === undefined) {
        return { valid: false, error: 'Missing field or value' };
      }
      if (!command.condition) {
        return { valid: false, error: 'Missing condition' };
      }
      break;

    case 'delete':
      if (!command.condition) {
        return { valid: false, error: 'Missing condition' };
      }
      break;

    case 'add':
      if (!command.columnName || !command.columnType) {
        return { valid: false, error: 'Missing column name or type' };
      }
      break;
  }

  return { valid: true };
}

/**
 * Get help text for commands
 */
export function getCommandHelp(): string {
  return `
Available Commands:

1. SET - Set a field value for Pokemon matching a condition
   Examples:
   - set hp to 100 for all pokemon of type 'grass'
   - set attack to 150 where name is 'pikachu'
   - set defense to 200 where hp > 100

2. UPDATE - Update a field value (alias for SET)
   Examples:
   - update speed to 200 where type is 'electric'
   - update ability to 'levitate' where name is 'gengar'

3. DELETE - Delete Pokemon matching a condition
   Examples:
   - delete rows where speed < 50
   - delete rows where generation is 1

4. ADD COLUMN - Add a new custom column
   Examples:
   - add column named 'generation' of type number
   - add column named 'notes' of type text
   - add column named 'favorite' of type boolean

Operators: is, =, >, <, contains
  `.trim();
}

// Re-export utility functions from types
export { parseConditionFromTypes as parseCondition, matchesConditionFromTypes as matchesCondition };