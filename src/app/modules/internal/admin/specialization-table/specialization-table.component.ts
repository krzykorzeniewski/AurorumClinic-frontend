import {
  AfterViewInit,
  Component,
  inject,
  OnDestroy,
  ViewChild,
} from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Location } from '@angular/common';
import { Router } from '@angular/router';
import {
  MatCell,
  MatCellDef,
  MatColumnDef,
  MatHeaderCell,
  MatHeaderCellDef,
  MatHeaderRow,
  MatHeaderRowDef,
  MatRow,
  MatRowDef,
  MatTable,
  MatTableDataSource,
} from '@angular/material/table';
import { ReactiveFormsModule } from '@angular/forms';
import { MatSort } from '@angular/material/sort';
import { Specialization } from '../../../core/models/specialization.model';
import { DoctorService } from '../../../core/services/doctor.service';
import { MatPaginator } from '@angular/material/paginator';
import { map, merge, startWith, Subject, Subscription, switchMap } from 'rxjs';
import { MatDialog } from '@angular/material/dialog';
import { EditSpecializationDialogComponent } from './edit-specialization-dialog/edit-specialization-dialog.component';
import { CreateSpecializationDialogComponent } from './create-specialization-dialog/create-specialization-dialog.component';

@Component({
  selector: 'app-specialization-table',
  standalone: true,
  imports: [
    MatCell,
    MatCellDef,
    MatColumnDef,
    MatHeaderCell,
    MatHeaderRow,
    MatHeaderRowDef,
    MatRow,
    MatRowDef,
    MatSort,
    MatTable,
    ReactiveFormsModule,
    MatHeaderCellDef,
    MatPaginator,
  ],
  templateUrl: './specialization-table.component.html',
  styleUrl: './specialization-table.component.css',
})
export class SpecializationTableComponent implements AfterViewInit, OnDestroy {
  private _doctorService = inject(DoctorService);
  private _snackBar = inject(MatSnackBar);
  private _dialog = inject(MatDialog);
  private _location = inject(Location);
  private _router = inject(Router);
  displayedColumns: string[] = ['name', 'edit'];
  dataSource!: MatTableDataSource<Specialization>;
  totalCount = 0;
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  sub = new Subscription();
  reload = new Subject<void>();

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

  ngAfterViewInit(): void {
    this.sub.add(
      merge(this.paginator.page, this.reload)
        .pipe(
          startWith({}),
          switchMap(() =>
            this._doctorService.getSpecializations(
              this.paginator.pageIndex,
              this.paginator.pageSize,
            ),
          ),
          map((response) => {
            this.totalCount = response.page.totalElements;
            return response.specializations;
          }),
        )
        .subscribe((res) => {
          this.dataSource = new MatTableDataSource(res);
        }),
    );
  }

  onSpecializationEdit(spec: Specialization) {
    const dialogRef = this._dialog.open(EditSpecializationDialogComponent, {
      data: {
        specialization: spec,
      },
      disableClose: true,
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result?.success) {
        this.reload.next();
        this._snackBar.open('Pomyślnie zmieniono specjalizacje', 'zamknij', {
          duration: 5000,
          panelClass: 'xxx-alert-info',
        });
      }
    });
  }

  onSpecializationCreate() {
    const dialogRef = this._dialog.open(CreateSpecializationDialogComponent, {
      disableClose: true,
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result?.success) {
        this.reload.next();
        this._snackBar.open('Pomyślnie dodano specjalizacje', 'zamknij', {
          duration: 5000,
          panelClass: 'xxx-alert-info',
        });
      }
    });
  }

  ngOnDestroy(): void {
    this.sub.unsubscribe();
    this.reload.complete();
  }
}
