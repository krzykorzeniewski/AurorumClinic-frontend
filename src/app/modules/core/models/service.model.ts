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

export interface FullService {
  id: number;
  name: string;
  price: BigNumber;
  duration: number;
  description: string;
}

export interface CreateService {
  name: string;
  price: BigNumber;
  duration: number;
  description: string;
  specializationIds: number[];
}

export interface UpdateService {
  name: string;
  price: BigNumber;
  description: string;
}
