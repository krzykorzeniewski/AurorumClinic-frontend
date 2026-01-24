import {
  Component,
  computed,
  effect,
  inject,
  input,
  output,
  signal,
} from '@angular/core';
import { DoctorAppointmentCardComponent } from '../../../shared/components/doctor-appointment-card/doctor-appointment-card.component';
import { Appointment } from '../../../core/models/appointment.model';
import { Location } from '@angular/common';
import { DoctorAppointmentCard } from '../../../core/models/doctor.model';
import { MatButton } from '@angular/material/button';
import { FormsService } from '../../../core/services/forms.service';
import {
  MatError,
  MatFormField,
  MatInput,
  MatLabel,
} from '@angular/material/input';
import { FormControl, ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-appointment-reschedule',
  standalone: true,
  imports: [
    DoctorAppointmentCardComponent,
    MatButton,
    MatError,
    MatFormField,
    MatInput,
    MatLabel,
    ReactiveFormsModule,
    MatFormField,
    MatError,
  ],
  templateUrl: './appointment-reschedule.component.html',
})
export class AppointmentRescheduleComponent {
  private _formService = inject(FormsService);
  private _location = inject(Location);
  appointment = input.required<Appointment>();

  confirmReschedule = output<{ date: string; description: string }>();

  additionalInformation =
    this._formService.getAdditionalInformationAppointmentForm();
  selectedDateTime = signal<string | null>(null);
  doctorAppointmentCard = computed(() => {
    const app = this.appointment();

    return new DoctorAppointmentCard(
      app.doctor.id,
      app.doctor.name,
      app.doctor.surname,
      app.doctor.specializations,
      app.doctor.profilePicture,
      null,
      app.service.id,
    );
  });

  constructor() {
    effect(() => {
      const app = this.appointment();
      this.additionalInformation.setValue(app.description || '');
    });
  }

  onConfirmReschedule() {
    if (this.selectedDateTime()) {
      this.confirmReschedule.emit({
        date: this.selectedDateTime()!,
        description: this.additionalInformation.value || '',
      });
    }
  }

  onCancel() {
    this._location.back();
  }

  onTimeSelected(dateTime: string) {
    this.selectedDateTime.set(dateTime);
  }

  getErrorMessage(control: FormControl) {
    return this._formService.getErrorMessage(control);
  }
}
