import { Component, inject, input, output } from '@angular/core';
import { AsyncPipe, DatePipe, NgForOf, NgIf } from '@angular/common';
import { MatIcon } from '@angular/material/icon';
import { MatIconButton } from '@angular/material/button';
import { MatMenu, MatMenuItem, MatMenuTrigger } from '@angular/material/menu';
import { map } from 'rxjs';
import { AuthService } from '../../../core/services/auth.service';
import { OpinionService } from '../../../core/services/opinion.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { UserRoleMap } from '../../../core/models/auth.model';
import { Router } from '@angular/router';
import { Opinion } from '../../../core/models/opinion.model';

@Component({
  selector: 'app-opinion-card',
  standalone: true,
  imports: [
    DatePipe,
    MatIcon,
    NgForOf,
    NgIf,
    MatIconButton,
    MatMenuTrigger,
    MatMenu,
    MatMenuItem,
    AsyncPipe,
  ],
  templateUrl: './opinion-card.component.html',
  styleUrl: './opinion-card.component.css',
})
export class OpinionCardComponent {
  private _opinionService = inject(OpinionService);
  private _router = inject(Router);
  private _authService = inject(AuthService);
  private _snackBar = inject(MatSnackBar);
  opinionId = input.required<number>();
  patientId = input.required<number>();
  patientName = input.required<string>();
  patientSurname = input.required<string>();
  rating = input.required<number>();
  comment = input.required<string>();
  createdAt = input.required<string>();
  answer = input.required<string | null>();
  answeredAt = input.required<string | null>();
  doctorId = input<number>();
  doctorName = input<string>();
  doctorSurname = input<string>();
  doctorPicture = input<string>();
  opinionDeleted = output<number>();
  isPatient$ = this._authService.user$.pipe(
    map(
      (user) =>
        user?.id === this.patientId() && user?.role === UserRoleMap.PATIENT,
    ),
  );
  isDoctor$ = this._authService.user$.pipe(
    map(
      (user) =>
        user?.id === this.doctorId() && user?.role === UserRoleMap.DOCTOR,
    ),
  );
  isAdmin$ = this._authService.user$.pipe(
    map((user) => user?.role === UserRoleMap.ADMIN),
  );

  createOpinionDoctor() {
    const opinion: Opinion = {
      id: this.opinionId(),
      createdAt: this.createdAt(),
      answeredAt: this.answeredAt() ? this.answeredAt() : null,
      comment: this.comment(),
      answer: this.answer() ? this.answer() : null,
      rating: this.rating(),
      patient: {
        id: this.patientId(),
        name: this.patientName(),
        surname: this.patientSurname(),
      },
    };
    void this._router.navigate(['/doctor/profile/opinion/answer'], {
      state: { opinion: opinion },
    });
  }

  editOpinionDoctor() {
    const opinion: Opinion = {
      id: this.opinionId(),
      createdAt: this.createdAt(),
      answeredAt: this.answeredAt() ? this.answeredAt() : null,
      comment: this.comment(),
      answer: this.answer() ? this.answer() : null,
      rating: this.rating(),
      patient: {
        id: this.patientId(),
        name: this.patientName(),
        surname: this.patientSurname(),
      },
    };
    void this._router.navigate(['/doctor/profile/opinion/answer/edit'], {
      state: { opinion: opinion },
    });
  }

  editOpinion() {
    void this._router.navigate(['/profile/appointments/opinion/edit'], {
      state: {
        opinionId: this.opinionId(),
        opinion: {
          rating: this.rating(),
          comment: this.comment(),
        },
      },
    });
  }

  deletePatientOpinion() {
    this._opinionService
      .deletePatientOpinionByPatient(this.opinionId())
      .subscribe({
        next: () => {
          this.opinionDeleted.emit(this.opinionId());
          this._snackBar.open('Pomyślnie usunięto opinię', 'zamknij', {
            duration: 5000,
            panelClass: 'xxx-alert-info',
          });
        },
        error: () => {
          this._snackBar.open(
            'Wystąpił błąd podczas usuwania opinii',
            'zamknij',
            {
              duration: 5000,
              panelClass: 'xxx-alert-error',
            },
          );
        },
      });
  }

  deletePatientOpinionByAdmin() {
    this._opinionService
      .deletePatientOpinionByAdmin(this.opinionId())
      .subscribe({
        next: () => {
          this.opinionDeleted.emit(this.opinionId());
          this._snackBar.open('Pomyślnie usunięto opinię', 'zamknij', {
            duration: 5000,
            panelClass: 'xxx-alert-info',
          });
        },
        error: () => {
          this._snackBar.open(
            'Wystąpił błąd podczas usuwania opinii',
            'zamknij',
            {
              duration: 5000,
              panelClass: 'xxx-alert-error',
            },
          );
        },
      });
  }
}
