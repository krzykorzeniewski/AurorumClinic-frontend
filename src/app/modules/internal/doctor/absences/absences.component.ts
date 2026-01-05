import { Component, inject } from '@angular/core';
import { NgForOf, NgIf } from '@angular/common';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { AbsenceService } from '../../../core/services/absence.service';
import { Absence } from '../../../core/models/absences.model';
import { MatListOption, MatSelectionList } from '@angular/material/list';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { MatButton } from '@angular/material/button';
import { CreateAbsenceDialogComponent } from './create-absence-dialog/create-absence-dialog.component';
import { MatDialog } from '@angular/material/dialog';

@Component({
  selector: 'app-absences',
  standalone: true,
  imports: [
    NgForOf,
    NgIf,
    MatSelectionList,
    MatListOption,
    MatPaginator,
    MatButton,
  ],
  templateUrl: './absences.component.html',
})
export class AbsencesComponent {
  private _absenceService = inject(AbsenceService);
  private _snackBar = inject(MatSnackBar);
  private _dialog = inject(MatDialog);
  private _router = inject(Router);
  private _page = 0;
  private _size = 5;
  absences: Absence[] = [];
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
    this.fetchAbsences();
  }

  onSelectionChange(options: MatListOption[]): void {
    if (options.length > 0) {
      this.selectedAbsenceId = options[0].value;
    } else {
      this.selectedAbsenceId = null;
    }
  }

  goBack() {
    void this._router.navigate(['/internal']);
  }

  deleteAbsence(): void {
    if (!this.selectedAbsenceId) {
      return;
    }

    this._absenceService.deleteAbsence(this.selectedAbsenceId).subscribe({
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
    const dialogRef = this._dialog.open(CreateAbsenceDialogComponent, {
      width: '500px',
      disableClose: true,
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
    this._absenceService.getAllAbsences(this._page, this._size).subscribe({
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
