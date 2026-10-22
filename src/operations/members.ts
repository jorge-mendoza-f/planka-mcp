/**
 * Card member operations for PLANKA API.
 */
import { plankaClient } from "../client.js";
import { CardMembership } from "../schemas/entities.js";
import { CardMembershipResponse } from "../schemas/responses.js";

/**
 * Add a user as a member of a card.
 * Uses PLANKA 2.0 /card-memberships endpoint. The user must be a board member.
 */
export async function addMemberToCard(
  cardId: string,
  userId: string
): Promise<CardMembership> {
  const response = await plankaClient.post<unknown>(
    `/api/cards/${cardId}/card-memberships`,
    { userId }
  );

  const parsed = CardMembershipResponse.parse(response);
  return parsed.item;
}

/**
 * Remove a user from a card's members.
 * PLANKA 2.0 addresses the membership by user ID (`userId:<id>`), not by membership ID.
 */
export async function removeMemberFromCard(
  cardId: string,
  userId: string
): Promise<void> {
  await plankaClient.delete(
    `/api/cards/${cardId}/card-memberships/userId:${userId}`
  );
}

/**
 * Set members on a card (add some, remove others).
 */
export async function setCardMembers(
  cardId: string,
  addUserIds?: string[],
  removeUserIds?: string[]
): Promise<void> {
  // Remove members first
  for (const userId of removeUserIds || []) {
    await removeMemberFromCard(cardId, userId);
  }

  for (const userId of addUserIds || []) {
    try {
      await addMemberToCard(cardId, userId);
    } catch (error) {
      // Ignore if user already on card
      const message = error instanceof Error ? error.message : String(error);
      if (!message.includes("already")) {
        throw error;
      }
    }
  }
}
