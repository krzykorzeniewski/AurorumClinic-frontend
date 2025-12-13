import { Component, input } from '@angular/core';
import { DatePipe, NgForOf, NgIf } from '@angular/common';
import { MatIcon } from '@angular/material/icon';
import { PaymentStatus } from '../../../core/models/appointment.model';

@Component({
  selector: 'app-doctor-card',
  standalone: true,
  imports: [MatIcon, NgIf, NgForOf, DatePipe],
  templateUrl: './doctor-card.component.html',
  styleUrl: './doctor-card.component.css',
})
export class DoctorCardComponent {
  id = input<number>(0);
  name = input<string>('');
  surname = input<string>('');
  specialization = input<string>('');
  rating = input<number>(0);
  profilePicture = input<string>('');
  date = input<string>('');
  price = input<number>(0);
  serviceName = input<string>('');
  paymentStatus = input<PaymentStatus>(PaymentStatus.CREATED);
  mode = input<'doctor' | 'visit' | 'appointmentRegister' | 'schedule'>(
    'doctor',
  );
  protected readonly PaymentStatus = PaymentStatus;
}
