import { Component, inject, input } from '@angular/core';
import { DatePipe, NgIf } from '@angular/common';
import { Doctor } from '../../../core/models/doctor.model';
import { Router } from '@angular/router';
import { AppointmentService } from '../../../core/services/appointment.service';

@Component({
  selector: 'app-patient-card',
  standalone: true,
  imports: [DatePipe, NgIf],
  templateUrl: './patient-card.component.html',
  styleUrl: './patient-card.component.css',
})
export class PatientCardComponent {
  private _router = inject(Router);
  private _appointmentService = inject(AppointmentService);
  appointmentId = input.required<number>();
  patientId = input<number>();
  name = input.required<string>();
  surname = input.required<string>();
  visitName = input.required<string>();
  date = input.required<string>();
  phoneNumber = input.required<string>();
  email = input.required<string>();
  doctor = input<Doctor | null>();
  mode = input<'collision' | 'profileDoctor' | 'employee'>('collision');

  goToDetailsDoctor() {
    void this._router.navigate(['/internal/appointments/details'], {
      state: {
        appointmentId: this.appointmentId(),
      },
    });
  }
  goToDetailsEmployee() {
    this._appointmentService
      .getAppointmentById(this.appointmentId())
      .subscribe({
        next: (res) => {
          void this._router.navigate(
            ['/internal/patients/${this.patientId()}/appointments/details'],
            {
              state: {
                appointment: res,
                patientId: this.patientId(),
              },
            },
          );
        },
      });
  }
}
