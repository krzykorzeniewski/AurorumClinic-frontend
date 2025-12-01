import BigNumber from 'bignumber.js';
import { PaymentStatus } from './appointment.model';

export interface ApiResponse<T> {
  status: string;
  data: T;
  message?: string;
}

export interface PageableResponse<T> {
  content: T[];
  page: {
    size: number;
    number: number;
    totalElements: number;
    totalPages: number;
  };
}

export class Payment {
  constructor(
    public id: number,
    public amount: BigNumber,
    public status: PaymentStatus,
  ) {}
}
