import {
  Component,
  inject,
  OnInit,
  signal,
  WritableSignal,
} from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { PatientService } from '../../../core/services/patient.service';
import { DatePipe, Location, NgClass, NgForOf, NgIf } from '@angular/common';
import { catchError, map, of, tap } from 'rxjs';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatButton } from '@angular/material/button';
import { Appointment } from '../../../core/models/appointment.model';
import { DoctorCardComponent } from '../../../shared/components/doctor-card/doctor-card.component';
import { GetPatientResponse } from '../../../core/models/patient.model';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-patient-profile',
  standalone: true,
  imports: [
    MatButton,
    NgIf,
    ReactiveFormsModule,
    FormsModule,
    NgClass,
    NgForOf,
    DatePipe,
    DoctorCardComponent,
    RouterLink,
  ],
  templateUrl: './patient-profile.component.html',
  styleUrl: './patient-profile.component.css',
})
export class PatientProfileComponent implements OnInit {
  private _patientService = inject(PatientService);
  private _snackBar = inject(MatSnackBar);
  private _route = inject(ActivatedRoute);
  private _location = inject(Location);
  private _router = inject(Router);
  private _page = 0;
  private _size = 5;
  patient!: GetPatientResponse;
  hasPesel: WritableSignal<boolean> = signal(true);
  visibleVisits: WritableSignal<boolean> = signal(false);
  appointmentsDone: Appointment[] = [];
  appointmentsFuture: Appointment[] = [];
  hasMoreData = true;

  constructor() {
    const navigation = this._router.getCurrentNavigation();
    if (navigation?.extras.state && navigation.extras.state['message']) {
      this._snackBar.open(navigation.extras.state['message'], 'zamknij', {
        duration: 5000,
        panelClass:
          navigation.extras.state['status'] === 'success'
            ? 'xxx-alert-info'
            : 'xxx-alert-error',
      });
    }
    this._location.replaceState(this._router.url);
  }

  ngOnInit(): void {
    this._route.paramMap
      .pipe(
        tap((params) => {
          const token = params.get('id');
          if (!token) {
            this._location.back();
            throw new Error('Brak uid użytkownika');
          }
        }),
        map((params) => Number(params.get('id'))),
      )
      .subscribe((id) => {
        this._patientService
          .getPatient(id)
          .pipe(
            tap((patient) => (this.patient = patient)),
            catchError(() => of(null)),
          )
          .subscribe((patient) => {
            if (!patient) {
              this._location.back();
            }
            this.fetchAppointments();
          });
      });
  }

  fetchMoreData(): void {
    this._page++;
    this.fetchAppointments();
  }

  updateData(patientId: number) {
    void this._router.navigate([`/internal/patients/${patientId}/edit`]);
  }

  goToDetails(patientId: number, appointment: Appointment) {
    void this._router.navigate(
      [`/internal/patients/${patientId}/appointments/details`],
      {
        state: { appointment, patientId },
      },
    );
  }

  private fetchAppointments(): void {
    this._patientService
      .getPatientAppointments(this.patient.id, this._page, this._size)
      .pipe(
        map((res) => ({
          done: res.appointments.filter((app) => app.status === 'FINISHED'),
          future: res.appointments.filter((app) => app.status === 'CREATED'),
          page: res.page,
        })),
      )
      .subscribe({
        next: (res) => {
          this.appointmentsDone = [...this.appointmentsDone, ...res.done];
          this.appointmentsFuture = [...this.appointmentsFuture, ...res.future];
          this.hasMoreData = res.page.number + 1 < res.page.totalPages;
        },
      });
  }

  toggleVisits() {
    this.visibleVisits.set(!this.visibleVisits());
  }
}
