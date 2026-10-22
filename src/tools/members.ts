/**
 * Card member tools for PLANKA MCP server.
 */
import { setCardMembers } from "../operations/members.js";
import { PlankaError } from "../errors.js";

/**
 * Tool: planka_set_card_members
 * Add or remove members (users) on a card.
 */
export const setCardMembersTool = {
  name: "planka_set_card_members",
  description:
    "Add or remove members on a card. Users must be board members (see planka_get_board).",
  inputSchema: {
    type: "object" as const,
    properties: {
      cardId: {
        type: "string",
        description: "The card ID",
      },
      addUserIds: {
        type: "array",
        items: { type: "string" },
        description: "User IDs to add",
      },
      removeUserIds: {
        type: "array",
        items: { type: "string" },
        description: "User IDs to remove",
      },
    },
    required: ["cardId"],
  },
  handler: async (params: {
    cardId: string;
    addUserIds?: string[];
    removeUserIds?: string[];
  }) => {
    try {
      await setCardMembers(
        params.cardId,
        params.addUserIds,
        params.removeUserIds
      );

      return {
        content: [
          {
            type: "text" as const,
            text: JSON.stringify(
              {
                success: true,
                cardId: params.cardId,
                membersAdded: params.addUserIds?.length || 0,
                membersRemoved: params.removeUserIds?.length || 0,
              },
              null,
              2
            ),
          },
        ],
      };
    } catch (error) {
      if (error instanceof PlankaError) {
        return {
          content: [{ type: "text" as const, text: `Error: ${error.message}` }],
          isError: true,
        };
      }
      throw error;
    }
  },
};

export const memberTools = [setCardMembersTool];
