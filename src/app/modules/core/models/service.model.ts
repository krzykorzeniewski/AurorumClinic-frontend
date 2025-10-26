export interface ServiceResponseApi {
  id: number;
  name: string;
  price?: number;
}

export class Service {
  constructor(
    public id: number,
    public name: string,
    public price: number,
  ) {}
}
