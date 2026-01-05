import { Component, inject, input } from '@angular/core';
import { DatePipe, NgIf } from '@angular/common';
import { Doctor } from '../../../core/models/doctor.model';
import { Router } from '@angular/router';

@Component({
  selector: 'app-patient-card',
  standalone: true,
  imports: [DatePipe, NgIf],
  templateUrl: './patient-card.component.html',
  styleUrl: './patient-card.component.css',
})
export class PatientCardComponent {
  private _router = inject(Router);
  id = input.required<number>();
  name = input.required<string>();
  surname = input.required<string>();
  visitName = input.required<string>();
  date = input.required<string>();
  phoneNumber = input.required<string>();
  email = input.required<string>();
  doctor = input<Doctor | null>();
  mode = input<'collision' | 'profileDoctor'>('collision');

  goToProfile() {
    void this._router.navigate(['/internal/appointments/details'], {
      state: {
        appointmentId: this.id(),
      },
    });
  }
}
