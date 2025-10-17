import BigNumber from 'bignumber.js';

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
    public amount: BigNumber,
    public status: string,
  ) {}
}
