import { Component, inject, input, output } from '@angular/core';
import { AsyncPipe, DatePipe, NgForOf, NgIf } from '@angular/common';
import { MatIcon } from '@angular/material/icon';
import { MatIconButton } from '@angular/material/button';
import { MatMenu, MatMenuItem, MatMenuTrigger } from '@angular/material/menu';
import { map } from 'rxjs';
import { AuthService } from '../../../core/services/auth.service';
import { OpinionService } from '../../../core/services/opinion.service';
import { MatSnackBar } from '@angular/material/snack-bar';

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
  private _authService = inject(AuthService);
  private _snackBar = inject(MatSnackBar);
  opinionId = input.required<number>();
  patientId = input.required<number>();
  patientName = input.required<string>();
  patientSurname = input.required<string>();
  rating = input.required<number>();
  comment = input.required<string>();
  createdAt = input.required<string>();
  answer = input<string | null>();
  answeredAt = input<string | null>();
  doctorName = input<string>();
  doctorSurname = input<string>();
  doctorPicture = input<string>();
  opinionDeleted = output<number>();
  isPatientOpinion$ = this._authService.user$.pipe(
    map((user) => user?.id === this.patientId()),
  );

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
}
