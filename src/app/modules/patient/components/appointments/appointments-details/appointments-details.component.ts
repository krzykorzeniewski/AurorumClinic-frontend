import { Component, inject, OnInit, signal } from '@angular/core';
import {
  Appointment,
  AppointmentStatus,
  PaymentStatus,
} from '../../../../core/models/appointment.model';
import { DoctorCardComponent } from '../../../../shared/components/doctor-card/doctor-card.component';
import { MatButton } from '@angular/material/button';
import { DatePipe, NgIf } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatFormField, MatInput, MatLabel } from '@angular/material/input';
import { Router, RouterLink } from '@angular/router';
import {
  MatAccordion,
  MatExpansionPanel,
  MatExpansionPanelDescription,
  MatExpansionPanelHeader,
  MatExpansionPanelTitle,
} from '@angular/material/expansion';
import { AppointmentService } from '../../../../core/services/appointment.service';
import { Chat } from '../../../../core/models/chat.model';

@Component({
  selector: 'app-appointments-details',
  standalone: true,
  imports: [
    DoctorCardComponent,
    MatButton,
    NgIf,
    DatePipe,
    FormsModule,
    MatFormField,
    MatInput,
    MatLabel,
    ReactiveFormsModule,
    RouterLink,
    MatAccordion,
    MatExpansionPanel,
    MatExpansionPanelHeader,
    MatExpansionPanelTitle,
    MatExpansionPanelDescription,
  ],
  templateUrl: './appointments-details.component.html',
  styleUrl: './appointments-details.component.css',
})
export class AppointmentsDetailsComponent implements OnInit {
  private _appointmentService = inject(AppointmentService);
  private _router = inject(Router);
  protected readonly PaymentStatus = PaymentStatus;
  protected readonly AppointmentStatus = AppointmentStatus;

  appointment = signal<Appointment | null>(null);

  ngOnInit(): void {
    const navigation = this._router.getCurrentNavigation();
    const state = navigation?.extras.state as { appointment: Appointment };

    if (state?.appointment) {
      this.appointment.set(state.appointment);
    } else {
      const historyState = history.state as { appointment: Appointment };
      if (historyState?.appointment) {
        this.appointment.set(historyState.appointment);
      } else {
        void this._router.navigate(['/profile/appointments']);
      }
    }
  }

  onCancelAppointment() {
    const currentAppointment = this.appointment();
    if (!currentAppointment) return;

    this._appointmentService
      .deletePatientAppointment(currentAppointment.id)
      .subscribe({
        next: () => {
          void this._router.navigate(['/profile/appointments'], {
            state: {
              message: 'Pomyślnie odwołano wizytę',
              status: 'success',
            },
          });
        },
        error: (err) => {
          void this._router.navigate(['/profile/appointments'], {
            state: {
              message: err.message,
              status: 'error',
            },
          });
        },
      });
  }

  onPayment() {
    const currentAppointment = this.appointment();
    if (!currentAppointment) return;

    void this._router.navigate(['/appointment/payment'], {
      state: {
        paymentId: currentAppointment.payment.id,
      },
    });
  }

  onRescheduleAppointment() {
    const currentAppointment = this.appointment();
    if (!currentAppointment) return;

    void this._router.navigate(['/appointment/reschedule'], {
      state: { appointment: currentAppointment },
    });
  }

  createOpinion() {
    const currentAppointment = this.appointment();
    if (!currentAppointment) return;

    void this._router.navigate(['/profile/appointments/opinion'], {
      state: { appointment: currentAppointment },
    });
  }

  chatWithDoctor() {
    const currentAppointment = this.appointment();
    if (!currentAppointment) return;

    const chat: Chat = {
      id: currentAppointment.doctor.id,
      name: currentAppointment.doctor.name,
      surname: currentAppointment.doctor.surname,
      profilePicture: currentAppointment.doctor.profilePicture,
    };

    void this._router.navigate(['/chats'], {
      state: { chat: chat },
    });
  }

  mapPaymentToVisibleStatus(payment: PaymentStatus) {
    return this._appointmentService.mapPaymentToVisibleStatus(payment);
  }
}
