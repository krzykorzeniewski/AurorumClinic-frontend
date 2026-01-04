import { Component, inject, signal } from '@angular/core';
import { AbsenceService } from '../../../core/services/absence.service';
import { DoctorService } from '../../../core/services/doctor.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { Absence } from '../../../core/models/absences.model';
import { GetFullDoctorApiResponse } from '../../../core/models/doctor.model';
import { MatListOption, MatSelectionList } from '@angular/material/list';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { DoctorCardComponent } from '../../../shared/components/doctor-card/doctor-card.component';
import { MatButton } from '@angular/material/button';
import { NgForOf, NgIf } from '@angular/common';
import { CreateDoctorAbsenceDialogComponent } from './create-doctor-absence-dialog/create-doctor-absence-dialog.component';

@Component({
  selector: 'app-doctor-absences',
  standalone: true,
  imports: [
    DoctorCardComponent,
    MatButton,
    MatListOption,
    MatPaginator,
    MatSelectionList,
    NgForOf,
    NgIf,
  ],
  templateUrl: './doctor-absences.component.html',
})
export class DoctorAbsencesComponent {
  private _absenceService = inject(AbsenceService);
  private _doctorService = inject(DoctorService);
  private _snackBar = inject(MatSnackBar);
  private _dialog = inject(MatDialog);
  private _router = inject(Router);
  private _page = 0;
  private _size = 5;
  absences: Absence[] = [];
  doctor = signal<GetFullDoctorApiResponse | null>(null);
  totalElements = 0;
  pageIndex = 0;
  selectedAbsenceId: number | null = null;

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

    const state = navigation?.extras.state as {
      doctorId: number;
    };

    if (!state?.doctorId) {
      void this._router.navigate(['/internal/schedules']);
      return;
    }

    this._doctorService.getDoctorById(state.doctorId).subscribe({
      next: (res) => {
        this.doctor.set(res);
        this.fetchAbsences();
      },
      error: () => {
        void this._router.navigate(['/internal/absences']);
      },
    });
  }

  onSelectionChange(options: MatListOption[]): void {
    if (options.length > 0) {
      this.selectedAbsenceId = options[0].value;
    } else {
      this.selectedAbsenceId = null;
    }
  }

  goBack() {
    void this._router.navigate(['/internal/doctors']);
  }

  deleteAbsence(): void {
    if (!this.selectedAbsenceId) {
      return;
    }

    const doctor = this.doctor();
    if (!doctor) {
      return;
    }

    this._absenceService
      .deleteAbsenceByEmployee(this.selectedAbsenceId)
      .subscribe({
        next: () => {
          this._snackBar.open('Nieobecność została usunięta', 'zamknij', {
            duration: 5000,
            panelClass: 'xxx-alert-info',
          });
          this.selectedAbsenceId = null;
          this.fetchAbsences();
        },
        error: (err) => {
          this._snackBar.open(err.message, 'zamknij', {
            duration: 5000,
            panelClass: 'xxx-alert-error',
          });
        },
      });
  }

  createAbsence() {
    const doctor = this.doctor();
    if (!doctor) {
      return;
    }

    const dialogRef = this._dialog.open(CreateDoctorAbsenceDialogComponent, {
      width: '500px',
      disableClose: true,
      data: { doctorId: doctor.id },
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result?.success) {
        this._snackBar.open('Nieobecność została utworzona', 'zamknij', {
          duration: 5000,
          panelClass: 'xxx-alert-info',
        });
        this.fetchAbsences();
      }
    });
  }

  onPageChange(event: PageEvent): void {
    this._page = event.pageIndex;
    this.fetchAbsences();
  }

  formatDate(date: string): string {
    return new Date(date).toLocaleDateString('pl-PL', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  }

  private fetchAbsences(): void {
    const doctor = this.doctor();
    if (!doctor) {
      void this._router.navigate(['/internal/absences']);
      return;
    }

    this._doctorService
      .getAllAbsences(doctor.id, this._page, this._size)
      .subscribe({
        next: (res) => {
          this.absences = res.absence;
          this.totalElements = res.page.totalElements;
          this.pageIndex = res.page.number;
        },
        error: (err) => {
          this._snackBar.open(err.message, 'zamknij', {
            duration: 5000,
            panelClass: 'xxx-alert-error',
          });
        },
      });
  }
}
