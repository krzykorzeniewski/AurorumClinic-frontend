import { AfterViewInit, Component, inject } from '@angular/core';
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
  ],
  templateUrl: './specialization-table.component.html',
  styleUrl: './specialization-table.component.css',
})
export class SpecializationTableComponent implements AfterViewInit {
  private _doctorService = inject(DoctorService);
  private _snackBar = inject(MatSnackBar);
  private _location = inject(Location);
  private _router = inject(Router);
  displayedColumns: string[] = ['name', 'edit'];
  dataSource!: MatTableDataSource<Specialization>;

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
    this._doctorService.getSpecializations().subscribe({
      next: (res) => {
        this.dataSource = new MatTableDataSource(res);
      },
    });
  }

  onSpecializationEdit(specId: number) {}

  onSpecializationCreate() {}
}
