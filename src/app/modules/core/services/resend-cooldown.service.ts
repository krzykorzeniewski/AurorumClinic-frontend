import { Injectable, signal, WritableSignal } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class ResendCooldownService {
  private timers = new Map<string, WritableSignal<number>>();
  private intervals = new Map<string, any>();

  init(key: string) {
    if (this.timers.has(key)) {
      return this.timers.get(key)!;
    }

    const expireAt = Number(localStorage.getItem(key) || 0);
    const remaining = Math.max(0, Math.ceil((expireAt - Date.now()) / 1000));

    const timer = signal(remaining);
    this.timers.set(key, timer);

    if (remaining > 0) {
      this.startInterval(key, expireAt);
    }

    return timer;
  }

  start(key: string, seconds: number) {
    if (this.intervals.has(key)) {
      clearInterval(this.intervals.get(key));
      this.intervals.delete(key);
    }

    const expireAt = Date.now() + seconds * 1000;
    localStorage.setItem(key, expireAt.toString());

    let timer = this.timers.get(key);
    if (!timer) {
      timer = signal(0);
      this.timers.set(key, timer);
    }

    timer.set(seconds);
    this.startInterval(key, expireAt);
  }

  clear(key: string) {
    if (this.intervals.has(key)) {
      clearInterval(this.intervals.get(key));
      this.intervals.delete(key);
    }

    this.timers.delete(key);
    localStorage.removeItem(key);
  }

  private startInterval(key: string, expireAt: number) {
    const timer = this.timers.get(key);
    if (!timer) return;

    const interval = setInterval(() => {
      const remaining = Math.max(0, Math.ceil((expireAt - Date.now()) / 1000));
      timer.set(remaining);

      if (remaining === 0) {
        this.clear(key);
      }
    }, 1000);

    this.intervals.set(key, interval);
  }
}
