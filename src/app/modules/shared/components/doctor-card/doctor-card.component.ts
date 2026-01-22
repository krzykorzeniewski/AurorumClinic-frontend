import { Component, inject, input } from '@angular/core';
import { DatePipe, NgForOf, NgIf } from '@angular/common';
import { MatIcon } from '@angular/material/icon';
import { PaymentStatus } from '../../../core/models/appointment.model';
import { Router } from '@angular/router';

@Component({
  selector: 'app-doctor-card',
  standalone: true,
  imports: [MatIcon, NgIf, NgForOf, DatePipe],
  templateUrl: './doctor-card.component.html',
  styleUrl: './doctor-card.component.css',
})
export class DoctorCardComponent {
  private _router = inject(Router);
  id = input<number>(0);
  name = input<string>('');
  surname = input<string>('');
  specialization = input<string | string[]>('');
  rating = input<number>(0);
  email = input<string>('');
  profilePicture = input<string>('');
  date = input<string>('');
  price = input<number>(0);
  serviceName = input<string>('');
  paymentStatus = input<PaymentStatus>(PaymentStatus.CREATED);
  education = input<string>('');
  experience = input<string>('');
  description = input<string>('');
  mode = input<
    'doctor' | 'visit' | 'appointmentRegister' | 'schedule' | 'profile'
  >('doctor');
  protected readonly PaymentStatus = PaymentStatus;

  protected goToProfile() {
    void this._router.navigate(['/doctor/profile'], {
      state: {
        doctorId: this.id(),
      },
    });
  }

  get specializationList(): string[] {
    const value = this.specialization();
    return Array.isArray(value) ? value : value ? [value] : [];
  }
}
