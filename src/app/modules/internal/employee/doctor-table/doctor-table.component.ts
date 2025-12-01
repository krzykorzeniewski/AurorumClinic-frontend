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
  displayedColumns: string[] = ['name', 'surname', 'rating', 'schedule'];
  dataSource!: MatTableDataSource<GetDoctorApiResponse>;
  totalCount = 0;
  sub = new Subscription();

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

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

  onSchedule() {}

  ngOnDestroy(): void {
    this.sub.unsubscribe();
  }
}
