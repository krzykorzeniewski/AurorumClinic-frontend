import {
  AfterViewInit,
  Component,
  inject,
  OnDestroy,
  OnInit,
  signal,
  ViewChild,
  WritableSignal,
} from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { PatientService } from '../../../core/services/patient.service';
import { DatePipe, Location, NgClass, NgForOf, NgIf } from '@angular/common';
import {
  catchError,
  distinctUntilChanged,
  EMPTY,
  map,
  merge,
  startWith,
  Subject,
  Subscription,
  switchMap,
  take,
  tap,
} from 'rxjs';
import { FormControl, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatButton } from '@angular/material/button';
import {
  Appointment,
  AppointmentStatus,
} from '../../../core/models/appointment.model';
import { DoctorCardComponent } from '../../../shared/components/doctor-card/doctor-card.component';
import { GetPatientResponse } from '../../../core/models/patient.model';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatPaginator } from '@angular/material/paginator';
import { MatFormField, MatLabel } from '@angular/material/input';
import { MatOption, MatSelect } from '@angular/material/select';

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
    MatFormField,
    MatLabel,
    MatSelect,
    MatPaginator,
    MatOption,
  ],
  templateUrl: './patient-profile.component.html',
  styleUrl: './patient-profile.component.css',
})
export class PatientProfileComponent
  implements OnInit, AfterViewInit, OnDestroy
{
  private _patientService = inject(PatientService);
  private _snackBar = inject(MatSnackBar);
  private _route = inject(ActivatedRoute);
  private _location = inject(Location);
  private _router = inject(Router);
  patient!: GetPatientResponse;
  hasPesel: WritableSignal<boolean> = signal(true);
  appointments: Appointment[] = [];
  appointmentType = new FormControl<AppointmentStatus>(
    AppointmentStatus.CREATED,
    { nonNullable: true },
  );
  sub = new Subscription();
  totalData = 0;
  appointmentTypes = [
    { key: AppointmentStatus.CREATED, label: 'Nadchodzące' },
    { key: AppointmentStatus.FINISHED, label: 'Poprzednie' },
  ];
  @ViewChild(MatPaginator, { static: false }) paginator!: MatPaginator;

  private patientLoaded$ = new Subject<void>();

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
    this.sub.add(
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
          switchMap((id) =>
            this._patientService.getPatient(id).pipe(
              catchError(() => {
                this._location.back();
                return EMPTY;
              }),
            ),
          ),
          tap((patient) => {
            this.patient = patient;
            this.patientLoaded$.next();
          }),
        )
        .subscribe(),
    );
  }

  ngAfterViewInit(): void {
    this.sub.add(
      this.patientLoaded$
        .pipe(
          take(1),
          switchMap(() =>
            merge(
              this.paginator.page,
              this.appointmentType.valueChanges.pipe(distinctUntilChanged()),
            ).pipe(
              startWith({}),
              switchMap(() => {
                return this._patientService.getPatientAppointments(
                  this.patient.id,
                  this.paginator.pageIndex,
                  this.paginator.pageSize,
                  this.appointmentType.value,
                );
              }),
              map((response) => {
                this.totalData = response.page.totalElements;
                return response.appointments;
              }),
            ),
          ),
        )
        .subscribe((appointments) => {
          this.appointments = appointments;
        }),
    );

    this.sub.add(
      this.appointmentType.valueChanges.subscribe(() => {
        if (this.paginator) {
          this.paginator.pageIndex = 0;
        }
      }),
    );
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

  ngOnDestroy(): void {
    this.sub.unsubscribe();
  }
}
