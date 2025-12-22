import { Component, input } from '@angular/core';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-patient-card',
  standalone: true,
  imports: [DatePipe],
  templateUrl: './patient-card.component.html',
  styleUrl: './patient-card.component.css',
})
export class PatientCardComponent {
  id = input<number>(0);
  name = input<string>('');
  surname = input<string>('');
  visitName = input<string>('');
  date = input<string>('');
  phoneNumber = input<string>('');
  email = input<string>('');
}
