export interface Chat {
  id: number;
  name: string;
  surname: string;
  profilePicture: string;
}

export interface MessageReceive {
  authorId: number;
  text: string;
  sentAt: string;
  receiverId: number;
}

export interface MessageSend {
  text: string;
  sentAt: string;
  receiverId: number;
}
