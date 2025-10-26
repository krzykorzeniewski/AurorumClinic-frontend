export interface SpecializationResponseApi {
  id: number;
  name: string;
}

export class Specialization {
  constructor(
    public id: number,
    public name: string,
  ) {}
}
