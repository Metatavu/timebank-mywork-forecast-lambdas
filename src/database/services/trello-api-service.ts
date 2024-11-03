import fetch from "node-fetch";

/**
 * Class that implements Trello Service for card operations.
 */
export class TrelloService {
  private readonly apiKey = process.env.TRELLO_API_KEY;
  private readonly apiToken = process.env.TRELLO_TOKEN;
  private readonly baseUrl = 'https://api.trello.com/1';
  private readonly boardId = process.env.TRELLO_MANAGEMENT_BOARD_ID;

  /**
   * Gets all boards from Trello
   *
   * @returns Trello board
   */
  public async getBoardList(): Promise<any[]> {
    const response = await fetch(`${this.baseUrl}/members/me/boards?key=${this.apiKey}&token=${this.apiToken}`, {
      method: 'GET',
    });
    
    if (!response.ok) {
      throw new Error(
        `Failed to fetch boards: ${response.status} - ${response.statusText}`
      );
    }
    return response.json();
  }

  /**
   * Creates a card on the specified Trello list
   *
   * @param title card title
   * @param description card description
   * @returns Trello card
   */
  public async createCard(title: string, description?: string): Promise<any> {
    const listId = await this.getListIdByName("Memo");
    const response = await fetch(`${this.baseUrl}/cards?key=${this.apiKey}&token=${this.apiToken}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        idList: listId,
        name: title,
        desc: description,
      }),
    });

    if (!response.ok) {
      throw new Error(
        `Failed to create card: ${response.status} - ${response.statusText}`
      );
    }
    return response.json();
  }

  /**
   * Gets card comments
   *
   * @param cards cards object
   * @returns Trello board
   */
  public async getCardsComments(cards: any[]): Promise<any[]> {
    const comments = await Promise.all(
      cards.map(async card => {
        const url = `${this.baseUrl}/cards/${card.id}/actions?filter=commentCard&key=${this.apiKey}&token=${this.apiToken}`;

        const response = await fetch(url, {
          method: 'GET',
          headers: { 'Content-Type': 'application/json' },
        });

        const comments = (await response.json()).map(comment => ({
          createdBy: comment.idMemberCreator || "",
          text: comment.data.text || "",
        }));
        return comments || [];
      })
    )
    return comments;
  }

  /**
   * Creates a comment to a card
   *
   * @param comment card comment
   * @param cardId card ID
   * @returns card comment
   */
  public async createComment(comment: string, cardId: string): Promise<any> {
    const response = await fetch(`${this.baseUrl}/cards/${cardId}/actions/comments?text=${comment}&key=${this.apiKey}&token=${this.apiToken}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        text: comment
      }),
    });

    if (!response.ok) {
      throw new Error(
        `Failed to create comment: ${response.status} - ${response.statusText}`
      );
    }
    return response.json();
  }

  /**
   * Deletes a card on the specified Trello list
   *
   * @param cardId card ID
   * @return deletion result
   */
  public async deleteCard(cardId: string): Promise<any> {
    const response = await fetch(`${this.baseUrl}/cards/${cardId}?key=${this.apiKey}&token=${this.apiToken}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        id: cardId
      }),
    });

    if (!response.ok) {
      throw new Error(
        `Failed to delete card: ${response.status} - ${response.statusText}`
      );
    }
    return response.json();
  }

  /**
   * Lists Trello lists
   *
   * @returns lists
   */
  public async getListsOnBoard(): Promise<any[]> {
    const response = await fetch(`${this.baseUrl}/boards/${this.boardId}/lists?key=${this.apiKey}&token=${this.apiToken}`, {
      method: 'GET',
    });
    if (!response.ok) throw new Error(`Failed to fetch lists: ${response.status} - ${response.statusText}`);
    return response.json();
  }

  /**
   * Lists Trello cards on a list
   *
   * @param listId  Trello ID list
   * @returns cards
   */
  public async getCardsOnList(): Promise<any[]> {
    const listId = await this.getListIdByName("Memo");
    const url = `${this.baseUrl}/lists/${listId}/cards?key=${this.apiKey}&token=${this.apiToken}`;
    
    const response = await fetch(url, {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' },
    });
    return await response.json();
  }
  /**
   * Lists specified Trello list
   *
   * @param name  list name
   * @returns list content
   */
  public getListIdByName = async (name: string) => {
  const lists = await this.getListsOnBoard();
  const listFound = lists.find(list => list.name == name);
  return listFound.id;
  }

  /**
   * Fetches email addresses of all users related to a specific board
   *
   * @returns emails
   */
  public async getBoardMembers(): Promise<string[]> {
    const response = await fetch(`${this.baseUrl}/boards/${this.boardId}/members?key=${this.apiKey}&token=${this.apiToken}`, {
      method: 'GET',
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch board members: ${response.status} - ${response.statusText}`);
    }
    const members = await response.json();
    const emails = members.map((member: any) => {
      const fullName = member.fullName.toLowerCase().split(' ');
      const [name, surname] = fullName;
      return `${name}.${surname}@metatavu.fi`;
    });
    return emails;
  }
}