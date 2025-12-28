import {
  AfterViewInit,
  Component,
  inject,
  OnDestroy,
  ViewChild,
} from '@angular/core';
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
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { map, merge, startWith, Subscription, switchMap } from 'rxjs';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort, MatSortHeader } from '@angular/material/sort';
import { GetDoctorApiResponse } from '../../../core/models/doctor.model';
import { DoctorService } from '../../../core/services/doctor.service';
import { Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-doctor-table',
  imports: [
    FormsModule,
    MatCell,
    MatCellDef,
    MatColumnDef,
    MatHeaderCell,
    MatHeaderRow,
    MatHeaderRowDef,
    MatPaginator,
    MatRow,
    MatRowDef,
    MatSort,
    MatSortHeader,
    MatTable,
    MatHeaderCellDef,
    ReactiveFormsModule,
  ],
  templateUrl: './doctor-table.component.html',
  styleUrl: './doctor-table.component.css',
})
export class DoctorTableComponent implements AfterViewInit, OnDestroy {
  private _doctorService = inject(DoctorService);
  private _snackBar = inject(MatSnackBar);
  private _router = inject(Router);
  displayedColumns: string[] = [
    'name',
    'surname',
    'rating',
    'daily_schedule',
    'weekly_schedule',
  ];
  dataSource!: MatTableDataSource<GetDoctorApiResponse>;
  totalCount = 0;
  sub = new Subscription();

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

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
  }

  ngAfterViewInit(): void {
    this.sort.sortChange.subscribe(() => (this.paginator.pageIndex = 0));

    this.sub.add(
      merge(this.sort.sortChange, this.paginator.page)
        .pipe(
          startWith({}),
          switchMap(() => {
            const pageIndex = this.paginator.pageIndex;
            const itemsPerPage = this.paginator.pageSize;
            const sortColumnName = this.sort.active;
            const sortDirection = this.sort.direction;

            return this._doctorService.getDoctors(
              pageIndex,
              itemsPerPage,
              sortColumnName,
              sortDirection,
            );
          }),
          map((response) => {
            this.totalCount = response.page.totalElements;
            return response.doctors;
          }),
        )
        .subscribe((doctors) => {
          this.dataSource = new MatTableDataSource<GetDoctorApiResponse>(
            doctors,
          );
        }),
    );
  }

  onDailySchedule(doctorId: number) {
    void this._router.navigate(['/internal/schedules/daily'], {
      state: {
        doctorId: doctorId,
      },
    });
  }

  onWeeklySchedule(doctorId: number) {
    void this._router.navigate(['/internal/schedules/weekly'], {
      state: {
        doctorId: doctorId,
      },
    });
  }

  ngOnDestroy(): void {
    this.sub.unsubscribe();
  }
}
