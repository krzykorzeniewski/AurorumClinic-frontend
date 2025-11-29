import {
  Component,
  computed,
  EventEmitter,
  inject,
  Input,
  OnChanges,
  Output,
  signal,
  SimpleChanges,
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
  styleUrl: './appointment-reschedule.component.css',
})
export class AppointmentRescheduleComponent implements OnChanges {
  private _formService = inject(FormsService);
  private _location = inject(Location);
  @Input({ required: true }) appointment!: Appointment;

  @Output() confirmReschedule = new EventEmitter<{
    date: string;
    description: string;
  }>();

  additionalInformation =
    this._formService.getAdditionalInformationAppointmentForm();
  selectedDateTime = signal<string | null>(null);
  doctorAppointmentCard = computed(() => {
    const app = this.appointment;
    if (!app) return;

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

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['appointment'] && this.appointment) {
      this.additionalInformation.setValue(this.appointment.description || '');
    }
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
