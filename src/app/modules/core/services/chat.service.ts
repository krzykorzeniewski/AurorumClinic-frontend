import { inject, Injectable, signal } from '@angular/core';
import { environment } from '../../../../environments/environment';
import { HttpClient, HttpParams } from '@angular/common/http';
import { catchError, tap, throwError } from 'rxjs';
import { Chat, MessageReceive, MessageSend } from '../models/chat.model';
import { AuthService } from './auth.service';
import { toSignal } from '@angular/core/rxjs-interop';
import { Client, IMessage } from '@stomp/stompjs';
import SockJS from 'sockjs-client';
import { ApiResponse, PageableResponse } from '../models/api-response.model';

@Injectable({
  providedIn: 'root',
})
export class ChatService {
  private _authService = inject(AuthService);
  private _http = inject(HttpClient);
  private _apiUrl = environment.apiUrl;
  private stompClient: Client | null = null;
  private reconnect = signal<number>(0);

  activeChat = signal<Chat | null>(null);
  messages = signal<MessageReceive[]>([]);
  chats = signal<Chat[]>([]);
  user = toSignal(this._authService.user$, { initialValue: undefined });
  currentPage = signal<number>(0);
  hasMoreMessages = signal<boolean>(true);
  isLoadingMessages = signal<boolean>(false);
  unreadChats = signal<Set<number>>(new Set());

  connect() {
    if (this.stompClient && this.stompClient.active) return;

    this.stompClient = new Client({
      webSocketFactory: () => new SockJS(environment.socketUrl),
      reconnectDelay: 3000,
      onConnect: () => {
        this.reconnect.set(0);
        this.stompClient?.subscribe(
          '/user/queue/messages',
          (message: IMessage) => {
            this.handleIncomingMessage(JSON.parse(message.body));
          },
        );
        this.getAllChats();
      },
      onWebSocketClose: () => {
        this.reconnect.update((v) => v + 1);

        if (this.reconnect() > 2) {
          this.disconnect();
        }
      },
    });

    this.stompClient.activate();
  }

  getAllChats() {
    if (!this.stompClient?.active) return;
    this._http
      .get<ApiResponse<Chat[]>>(`${this._apiUrl}/chats/me`, {
        withCredentials: true,
      })
      .pipe(
        tap((res) => this.chats.set(res.data)),
        catchError(() => {
          return throwError(
            () =>
              new Error(
                'Wystąpił błąd w trakcie pozyskiwania konwersacji. Spróbuj ponownie później.',
              ),
          );
        }),
      )
      .subscribe();
  }

  getAllMessagesById(chat: Chat) {
    this.activeChat.set(chat);
    this.messages.set([]);
    this.currentPage.set(0);
    this.hasMoreMessages.set(true);
    this.loadMessages(chat.id, 0);
    this.markChatAsRead(chat.id);
  }

  loadMoreMessages() {
    const chat = this.activeChat();
    if (!chat || this.isLoadingMessages() || !this.hasMoreMessages()) {
      return;
    }

    const nextPage = this.currentPage() + 1;
    this.loadMessages(chat.id, nextPage);
  }

  sendMessage(text: string) {
    const receiver = this.activeChat();
    const sender = this.user();

    if (!receiver || !sender || !this.stompClient || !this.stompClient.active) {
      return;
    }

    const messagePayload: MessageSend = {
      text: text,
      sentAt: new Date().toLocaleString('sv-SE').replace(' ', 'T'),
      receiverId: receiver.id,
    };

    this.stompClient.publish({
      destination: '/app/chat',
      body: JSON.stringify(messagePayload),
    });

    const optimisticMessage: MessageReceive = {
      text: text,
      sentAt: new Date().toISOString(),
      authorId: sender.id,
      receiverId: receiver.id,
    };

    this.messages.update((msgs) => [...msgs, optimisticMessage]);
  }

  markChatAsRead(chatId: number) {
    this.unreadChats.update((unread) => {
      const newSet = new Set(unread);
      newSet.delete(chatId);
      return newSet;
    });
  }

  isChatUnread(chatId: number): boolean {
    return this.unreadChats().has(chatId);
  }

  clearActiveChat() {
    this.activeChat.set(null);
    this.messages.set([]);
    this.currentPage.set(0);
    this.hasMoreMessages.set(true);
    this.isLoadingMessages.set(false);
  }

  disconnect() {
    if (this.stompClient) {
      void this.stompClient.deactivate();
      this.clearActiveChat();
    }
  }

  private handleIncomingMessage(message: MessageReceive) {
    const currentChat = this.activeChat();
    const receiver = this.user();

    if (!receiver) return;

    if (currentChat) {
      const newMessage: MessageReceive = {
        text: message.text,
        sentAt: message.sentAt,
        authorId: currentChat.id!,
        receiverId: receiver.id,
      };
      if (
        newMessage.authorId === currentChat.id ||
        newMessage.authorId === receiver.id
      ) {
        this.messages.update((msgs) => [...msgs, newMessage]);
      }
    } else {
      if (message.receiverId === receiver.id) {
        const senderId = message.authorId;

        this.unreadChats.update((unread) => {
          const newSet = new Set(unread);
          newSet.add(senderId);
          return newSet;
        });
      }
    }
  }

  private loadMessages(chatId: number, page: number) {
    this.isLoadingMessages.set(true);
    const params = new HttpParams()
      .set('page', page)
      .set('sort', 'sentAt,desc');

    this._http
      .get<ApiResponse<PageableResponse<MessageReceive>>>(
        `${this._apiUrl}/messages/me/${chatId}`,
        {
          params: params,
          withCredentials: true,
        },
      )
      .pipe(
        tap((res) => {
          const newMessages = res.data.content.reverse();

          if (page === 0) {
            this.messages.set(newMessages);
          } else {
            this.messages.update((msgs) => [...newMessages, ...msgs]);
          }

          this.currentPage.set(page);

          const hasMore = res.data.page.number < res.data.page.totalPages - 1;
          this.hasMoreMessages.set(hasMore);

          this.isLoadingMessages.set(false);
        }),
        catchError(() => {
          this.isLoadingMessages.set(false);
          return throwError(
            () =>
              new Error(
                'Wystąpił błąd w trakcie pozyskiwania pozostałych wiadomości. Spróbuj ponownie później.',
              ),
          );
        }),
      )
      .subscribe();
  }
}
