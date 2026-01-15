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
  MatNoDataRow,
  MatRow,
  MatRowDef,
  MatTable,
  MatTableDataSource,
} from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import {
  debounceTime,
  distinctUntilChanged,
  map,
  merge,
  startWith,
  Subscription,
  switchMap,
} from 'rxjs';
import { PatientService } from '../../../core/services/patient.service';
import { MatFormField, MatInput, MatLabel } from '@angular/material/input';
import { Router } from '@angular/router';
import { GetPatientResponse } from '../../../core/models/patient.model';
import { MatIcon } from '@angular/material/icon';
import { MatOption, MatSelect } from '@angular/material/select';

@Component({
  selector: 'app-patient-table',
  standalone: true,
  imports: [
    MatInput,
    MatTable,
    MatColumnDef,
    MatCell,
    MatHeaderCell,
    MatSortModule,
    MatHeaderCellDef,
    MatCellDef,
    MatHeaderRow,
    MatRowDef,
    MatPaginator,
    ReactiveFormsModule,
    MatHeaderRowDef,
    MatRow,
    MatNoDataRow,
    MatFormField,
    MatLabel,
    MatIcon,
    MatSelect,
    MatOption,
  ],
  templateUrl: './patient-table.component.html',
  styleUrl: './patient-table.component.css',
})
export class PatientTableComponent implements AfterViewInit, OnDestroy {
  private _patientService = inject(PatientService);
  private _router = inject(Router);
  displayedColumns: string[] = [
    'name',
    'surname',
    'email',
    'phoneNumber',
    'pesel',
    'actions',
  ];
  dataSource!: MatTableDataSource<GetPatientResponse>;
  totalCount = 0;
  filterValue = new FormControl('', { nonNullable: true });
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

            return this._patientService.getPatients(
              pageIndex,
              itemsPerPage,
              sortColumnName,
              sortDirection,
            );
          }),
          map((response) => {
            this.totalCount = response.page.totalElements;
            return response.patients;
          }),
        )
        .subscribe((patients) => {
          this.dataSource = new MatTableDataSource<GetPatientResponse>(
            patients,
          );
        }),
    );

    this.sub.add(
      this.filterValue.valueChanges
        .pipe(debounceTime(800), distinctUntilChanged())
        .subscribe((value) => {
          const valueTrimmed = value?.trim();
          this.applyFilter(valueTrimmed);
        }),
    );
  }

  applyFilter(value: string) {
    const pageIndex = this.paginator.pageIndex;
    const itemsPerPage = this.paginator.pageSize;
    const sortDirection = this.sort.direction;
    const sortColumnName = this.sort.active;

    this._patientService
      .getPatients(
        pageIndex,
        itemsPerPage,
        sortColumnName,
        sortDirection,
        value,
      )
      .subscribe({
        next: (response) => {
          this.totalCount = response.page.totalElements;
          this.dataSource = new MatTableDataSource<GetPatientResponse>(
            response.patients,
          );
        },
      });

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  onPatientAction(action: string, row: any): void {
    switch (action) {
      case 'profile':
        void this._router.navigate(['/internal/patients', row.id]);
        break;

      case 'appointment':
        this.onCreateAppointment(row);
        break;
    }
  }

  onCreateAppointment(patient: GetPatientResponse) {
    void this._router.navigate(['/appointment/search'], {
      state: {
        patient: patient,
      },
    });
  }

  ngOnDestroy(): void {
    this.sub.unsubscribe();
  }
}
