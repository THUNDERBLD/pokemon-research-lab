import { useState } from 'react';
import {
  ParsedCommand,
  CommandResult,
  COMMAND_PATTERNS,
  parseCondition,
  matchesCondition,
} from '@/types/commands';
import { usePokemonData } from './usePokemonData';

/**
 * Custom hook for parsing and executing chat commands
 * Supports: set, update, delete, add column commands
 */
export function useCommandParser() {
  const [isExecuting, setIsExecuting] = useState(false);
  const {
    pokemons,
    updatePokemon,
    deleteMultiplePokemons,
    bulkUpdateByCondition,
    addCustomColumn,
  } = usePokemonData();

  // Parse user command
  const parseCommand = (input: string): ParsedCommand => {
    const trimmedInput = input.trim();

    // Check SET pattern
    const setMatch = trimmedInput.match(COMMAND_PATTERNS.SET);
    if (setMatch) {
      const field = setMatch[1];
      const value = setMatch[2].replace(/['"]/g, '');
      const type = setMatch[3];
      const conditionStr = setMatch[4];

      if (type) {
        // "set hp to 100 for all pokemon of type 'grass'"
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
      } else if (conditionStr) {
        // "set hp to 100 where speed > 50"
        const condition = parseCondition(conditionStr);
        return {
          type: 'set',
          field,
          value,
          condition: condition || undefined,
        };
      }
    }

    // Check UPDATE pattern
    const updateMatch = trimmedInput.match(COMMAND_PATTERNS.UPDATE);
    if (updateMatch) {
      const field = updateMatch[1];
      const value = updateMatch[2].replace(/['"]/g, '');
      const conditionStr = updateMatch[3];
      const condition = parseCondition(conditionStr);

      return {
        type: 'update',
        field,
        value,
        condition: condition || undefined,
      };
    }

    // Check DELETE pattern
    const deleteMatch = trimmedInput.match(COMMAND_PATTERNS.DELETE);
    if (deleteMatch) {
      const conditionStr = deleteMatch[1];
      const condition = parseCondition(conditionStr);

      return {
        type: 'delete',
        condition: condition || undefined,
      };
    }

    // Check ADD COLUMN pattern
    const addColumnMatch = trimmedInput.match(COMMAND_PATTERNS.ADD_COLUMN);
    if (addColumnMatch) {
      const columnName = addColumnMatch[1];
      const columnType = addColumnMatch[2].toLowerCase();

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

    // Unknown command
    return {
      type: 'unknown',
      error: 'Command not recognized. Try: "set hp to 100 for all pokemon of type \'grass\'"',
    };
  };

  // Execute parsed command
  const executeCommand = async (command: ParsedCommand): Promise<CommandResult> => {
    setIsExecuting(true);

    try {
      switch (command.type) {
        case 'set':
        case 'update':
          if (!command.field || command.value === undefined || !command.condition) {
            return {
              success: false,
              message: 'Invalid command format',
              error: 'Missing field, value, or condition',
            };
          }

          // Count affected pokemons
          const affectedPokemons = pokemons.filter((p) =>
            matchesCondition(p, command.condition!)
          );

          if (affectedPokemons.length === 0) {
            return {
              success: false,
              message: 'No pokemon matched the condition',
              affectedCount: 0,
            };
          }

          // Update pokemons
          bulkUpdateByCondition(
            (p) => matchesCondition(p, command.condition!),
            { [command.field]: command.value }
          );

          return {
            success: true,
            message: `Updated ${command.field} to ${command.value} for ${affectedPokemons.length} pokemon(s)`,
            affectedCount: affectedPokemons.length,
          };

        case 'delete':
          if (!command.condition) {
            return {
              success: false,
              message: 'Invalid delete command',
              error: 'Missing condition',
            };
          }

          const toDelete = pokemons.filter((p) =>
            matchesCondition(p, command.condition!)
          );

          if (toDelete.length === 0) {
            return {
              success: false,
              message: 'No pokemon matched the condition',
              affectedCount: 0,
            };
          }

          const idsToDelete = toDelete.map((p) => p.id);
          deleteMultiplePokemons(idsToDelete);

          return {
            success: true,
            message: `Deleted ${toDelete.length} pokemon(s)`,
            affectedCount: toDelete.length,
          };

        case 'add':
          if (!command.columnName || !command.columnType) {
            return {
              success: false,
              message: 'Invalid add column command',
              error: 'Missing column name or type',
            };
          }

          const defaultValue =
            command.columnType === 'number'
              ? 0
              : command.columnType === 'boolean'
              ? false
              : '';

          addCustomColumn({
            id: command.columnName.toLowerCase().replace(/\s+/g, '_'),
            name: command.columnName,
            type: command.columnType,
            defaultValue,
          });

          return {
            success: true,
            message: `Added column "${command.columnName}" of type ${command.columnType}`,
          };

        case 'unknown':
        default:
          return {
            success: false,
            message: 'Command not recognized',
            error: command.error || 'Unknown command',
          };
      }
    } catch (error) {
      return {
        success: false,
        message: 'Error executing command',
        error: error instanceof Error ? error.message : 'Unknown error',
      };
    } finally {
      setIsExecuting(false);
    }
  };

  // Execute command from string input
  const executeFromString = async (input: string): Promise<CommandResult> => {
    const command = parseCommand(input);
    return executeCommand(command);
  };

  return {
    isExecuting,
    parseCommand,
    executeCommand,
    executeFromString,
  };
}