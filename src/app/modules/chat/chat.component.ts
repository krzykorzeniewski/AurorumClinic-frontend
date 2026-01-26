import {
  AfterViewChecked,
  Component,
  effect,
  ElementRef,
  inject,
  model,
  OnDestroy,
  ViewChild,
} from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ChatService } from '../core/services/chat.service';
import { Chat } from '../core/models/chat.model';
import { DatePipe, NgForOf, NgIf, NgStyle } from '@angular/common';
import { Router } from '@angular/router';
import { MatIcon } from '@angular/material/icon';

@Component({
  selector: 'app-chat',
  standalone: true,
  imports: [FormsModule, DatePipe, NgForOf, NgIf, NgStyle, MatIcon],
  templateUrl: './chat.component.html',
})
export class ChatComponent implements AfterViewChecked, OnDestroy {
  private _chatService = inject(ChatService);
  private _router = inject(Router);
  private onResize = () => this.checkScreenSize();
  message = model<string>('');
  chats = this._chatService.chats;
  messages = this._chatService.messages;
  selectedChat = this._chatService.activeChat;
  isLoadingMessages = this._chatService.isLoadingMessages;
  hasMoreMessages = this._chatService.hasMoreMessages;
  isSmallScreen = false;

  @ViewChild('messagesContainer') messagesContainer!: ElementRef;
  private shouldScrollToBottom = true;
  private isLoadingMore = false;
  private previousScrollHeight = 0;

  constructor() {
    const navigation = this._router.getCurrentNavigation();
    const state = navigation?.extras.state as {
      chat: Chat;
    };
    if (state?.chat) {
      const existingChat = this._chatService
        .chats()
        .find((c) => c.id === state.chat.id);

      if (existingChat) {
        this._chatService.activeChat.set(existingChat);
      } else {
        this._chatService.chats.update((chats) => [...chats, state.chat]);
        this._chatService.activeChat.set(state.chat);
      }
    }
    effect(() => {
      this.messages();
      if (!this.isLoadingMore) {
        this.shouldScrollToBottom = true;
      }
    });
    this.checkScreenSize();
    window.addEventListener('resize', () => this.onResize());
  }

  selectChat(chat: Chat) {
    this.shouldScrollToBottom = true;
    this.isLoadingMore = false;
    this._chatService.getAllMessagesById(chat);
  }

  sendMessage() {
    const msgText = this.message();
    if (!msgText || msgText.trim() === '') return;
    this.shouldScrollToBottom = true;
    this._chatService.sendMessage(msgText);
    this.message.set('');
  }

  onScroll(event: Event) {
    const element = event.target as HTMLElement;

    if (
      element.scrollTop < 100 &&
      !this.isLoadingMessages() &&
      this.hasMoreMessages() &&
      !this.isLoadingMore
    ) {
      this.isLoadingMore = true;
      this.shouldScrollToBottom = false;
      this.previousScrollHeight = element.scrollHeight;

      this._chatService.loadMoreMessages();
    }
  }

  isChatUnread(chatId: number): boolean {
    return this._chatService.isChatUnread(chatId);
  }

  ngAfterViewChecked() {
    if (this.shouldScrollToBottom) {
      this.scrollToBottom();
      this.shouldScrollToBottom = false;
    } else if (this.isLoadingMore && !this.isLoadingMessages()) {
      this.restoreScrollPosition();
      this.isLoadingMore = false;
    }
  }

  checkScreenSize() {
    this.isSmallScreen = window.innerWidth < 768;
  }

  deselectChat() {
    this.selectedChat.set(null);
  }

  private scrollToBottom(): void {
    if (this.messagesContainer?.nativeElement) {
      requestAnimationFrame(() => {
        const element = this.messagesContainer.nativeElement;
        element.scrollTop = element.scrollHeight;
      });
    }
  }

  private restoreScrollPosition(): void {
    if (this.messagesContainer) {
      const element = this.messagesContainer.nativeElement;
      const newScrollHeight = element.scrollHeight;
      element.scrollTop = newScrollHeight - this.previousScrollHeight;
    }
  }

  ngOnDestroy(): void {
    this._chatService.clearActiveChat();
    window.removeEventListener('resize', () => this.onResize());
  }
}
