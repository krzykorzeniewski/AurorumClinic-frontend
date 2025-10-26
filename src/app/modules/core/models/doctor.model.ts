import { Specialization } from './specialization.model';
import { Service } from './service.model';

export interface GetRecommendedDoctorApiResponse {
  id: number;
  name: string;
  surname: string;
  specializations: Specialization[];
  profilePicture: string;
  rating: number;
}

export class DoctorRecommended implements GetRecommendedDoctorApiResponse {
  constructor(
    public id: number,
    public name: string,
    public surname: string,
    public specializations: Specialization[],
    public profilePicture: string,
    public rating: number,
  ) {}
}

export class Doctor {
  constructor(
    public id: number,
    public name: string,
    public surname: string,
    public specializations: Specialization[],
    public profilePicture: string,
  ) {}
}

export class DoctorAppointmentCard {
  constructor(
    public id = 0,
    public name = '',
    public surname = '',
    public specializations: Specialization[] = [],
    public profilePicture = '',
    public rating: number | null = null,
    public serviceId = 0,
  ) {}
}
export interface SpecializationWithServices {
  id: number;
  name: string;
  services: Service[];
}
