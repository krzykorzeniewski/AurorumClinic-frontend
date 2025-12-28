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

export type GetDoctorApiResponse = GetRecommendedDoctorApiResponse;

export interface GetFullDoctorApiResponse {
  id: number;
  name: string;
  surname: string;
  specializations: Specialization[];
  profilePicture: string;
  rating: number;
  birthdate: string;
  phoneNumber: string;
  education: string;
  experience: string;
  pwzNumber: string;
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

export interface DoctorPanelStats {
  totalScheduled: number;
  totalFinished: number;
  nextAppointment: string;
}

export interface ServiceStatistics {
  scheduled: number;
  finished: number;
  avgDuration: number | null;
  avgRating: number | null;
  service: {
    id: number;
    name: string;
  };
}

export interface DoctorTotalStatistics {
  totalScheduled: number;
  totalFinished: number | null;
  avgDuration: number | null;
  avgRating: number | null;
  services: ServiceStatistics[];
}

export interface DoctorStatisticsInfo {
  doctorId: number;
  name: string;
  surname: string;
  profilePicture: string;
  specializations: Specialization[];
  total: DoctorTotalStatistics[];
}

export interface DoctorStatisticsData {
  totalScheduled: number;
  totalFinished: number;
  avgDuration: number;
  avgRating: number | null;
  doctors: DoctorStatisticsInfo[];
}
