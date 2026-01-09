import { inject, Injectable } from '@angular/core';
import { environment } from '../../../../environments/environment';
import { HttpClient, HttpParams } from '@angular/common/http';
import { ApiResponse, PageableResponse } from '../models/api-response.model';
import { catchError, map, throwError } from 'rxjs';
import {
  CreateNewsletter,
  NewsletterMessageResponse,
  UpdateNewsletterMessagePrompt,
} from '../models/newsletter.model';

@Injectable({
  providedIn: 'root',
})
export class NewsletterService {
  private _apiUrl = environment.apiUrl + '/newsletter';
  private _http = inject(HttpClient);

  getAllScheduled(
    page: number,
    size: number,
    sort: string,
    direction: 'asc' | 'desc' | '',
  ) {
    let params = new HttpParams().set('page', page).set('size', size);
    if (sort) {
      if (direction) {
        params = params.set('sort', `${sort},${direction}`);
      } else {
        params = params.set('sort', sort);
      }
    }
    return this._http
      .get<ApiResponse<PageableResponse<NewsletterMessageResponse>>>(
        `${this._apiUrl}/messages/scheduled`,
        {
          params: params,
          headers: {
            'Content-Type': 'application/json',
          },
          withCredentials: true,
        },
      )
      .pipe(
        map((res) => {
          return {
            messagesScheduled: res.data.content,
            page: res.data.page,
          };
        }),
        catchError(() => {
          return throwError(
            () => new Error('Wystąpił błąd serwera. Spróbuj ponownie później.'),
          );
        }),
      );
  }

  getAllNotScheduledMessages(
    page: number,
    size: number,
    sort: string,
    direction: 'asc' | 'desc' | '',
  ) {
    let params = new HttpParams().set('page', page).set('size', size);
    if (sort) {
      if (direction) {
        params = params.set('sort', `${sort},${direction}`);
      } else {
        params = params.set('sort', sort);
      }
    }
    return this._http
      .get<ApiResponse<PageableResponse<NewsletterMessageResponse>>>(
        `${this._apiUrl}/messages`,
        {
          params: params,
          headers: {
            'Content-Type': 'application/json',
          },
          withCredentials: true,
        },
      )
      .pipe(
        map((res) => {
          return {
            messages: res.data.content,
            page: res.data.page,
          };
        }),
        catchError(() => {
          return throwError(
            () => new Error('Wystąpił błąd serwera. Spróbuj ponownie później.'),
          );
        }),
      );
  }

  getMessageById(messageId: number) {
    return this._http
      .get<ApiResponse<NewsletterMessageResponse>>(
        `${this._apiUrl}/messages/${messageId}`,
        {
          headers: {
            'Content-Type': 'application/json',
          },
          withCredentials: true,
        },
      )
      .pipe(
        map((res) => {
          return res.data;
        }),
        catchError(() => {
          return throwError(
            () => new Error('Wystąpił błąd serwera. Spróbuj ponownie później.'),
          );
        }),
      );
  }

  reviewMessagePrompt(messageId: number, data: UpdateNewsletterMessagePrompt) {
    return this._http
      .put<void>(`${this._apiUrl}/messages/${messageId}`, data, {
        withCredentials: true,
        headers: {
          'Content-Type': 'application/json',
        },
      })
      .pipe(
        catchError(() => {
          return throwError(
            () => new Error('Wystąpił błąd serwera. Spróbuj ponownie później.'),
          );
        }),
      );
  }

  createNewNewsletterMessagePrompt(message: string | null) {
    let params = new HttpParams();

    if (message) {
      params = params.append('prompt', message);
    }

    return this._http
      .post<ApiResponse<CreateNewsletter>>(
        `${this._apiUrl}/messages`,
        {},
        {
          params: params,
          withCredentials: true,
          headers: {
            'Content-Type': 'application/json',
          },
        },
      )
      .pipe(
        catchError(() => {
          return throwError(
            () => new Error('Wystąpił błąd serwera. Spróbuj ponownie później.'),
          );
        }),
      );
  }
}
