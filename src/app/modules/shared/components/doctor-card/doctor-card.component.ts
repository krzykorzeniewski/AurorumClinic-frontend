import { Component, input } from '@angular/core';
import { DatePipe, NgForOf, NgIf } from '@angular/common';
import { MatIcon } from '@angular/material/icon';

@Component({
  selector: 'app-doctor-card',
  standalone: true,
  imports: [MatIcon, NgIf, NgForOf, DatePipe],
  templateUrl: './doctor-card.component.html',
  styleUrl: './doctor-card.component.css',
})
export class DoctorCardComponent {
  id = input<number>(-1);
  name = input<string>('');
  surname = input<string>('');
  specialization = input<string>('');
  rating = input<string>('');
  profilePicture = input<string>('');
  date = input<string>('');
  price = input<number>(-1);
  serviceName = input<string>('');
  mode = input<'doctor' | 'visit'>('doctor');
}
