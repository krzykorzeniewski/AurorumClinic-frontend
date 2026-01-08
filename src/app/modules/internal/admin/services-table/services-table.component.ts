import {
  AfterViewInit,
  Component,
  inject,
  OnDestroy,
  ViewChild,
} from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatDialog } from '@angular/material/dialog';
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
import { MatPaginator } from '@angular/material/paginator';
import { map, merge, startWith, Subject, Subscription, switchMap } from 'rxjs';
import { CreateServiceDialogComponent } from './create-service-dialog/create-service-dialog.component';
import { EditServiceDialogComponent } from './edit-service-dialog/edit-service-dialog.component';
import { FullService } from '../../../core/models/service.model';
import { MatSort, MatSortHeader } from '@angular/material/sort';
import { ServicesService } from '../../../core/services/services.service';

@Component({
  selector: 'app-services-table',
  standalone: true,
  imports: [
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
    MatTable,
    MatHeaderCellDef,
    MatSortHeader,
  ],
  templateUrl: './services-table.component.html',
  styleUrl: './services-table.component.css',
})
export class ServicesTableComponent implements AfterViewInit, OnDestroy {
  private _servicesService = inject(ServicesService);
  private _snackBar = inject(MatSnackBar);
  private _dialog = inject(MatDialog);
  private _location = inject(Location);
  private _router = inject(Router);
  displayedColumns: string[] = [
    'name',
    'price',
    'duration',
    'description',
    'edit',
  ];
  dataSource!: MatTableDataSource<FullService>;
  totalCount = 0;
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;
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
      merge(this.sort.sortChange, this.paginator.page, this.reload)
        .pipe(
          startWith({}),
          switchMap(() =>
            this._servicesService.getServices(
              this.paginator.pageIndex,
              this.paginator.pageSize,
              this.sort.active,
              this.sort.direction,
            ),
          ),
          map((response) => {
            this.totalCount = response.page.totalElements;
            return response.services;
          }),
        )
        .subscribe((res) => {
          this.dataSource = new MatTableDataSource(res);
        }),
    );
  }

  onServiceEdit(service: FullService) {
    const dialogRef = this._dialog.open(EditServiceDialogComponent, {
      data: {
        service: service,
      },
      disableClose: true,
      maxWidth: '600px',
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result?.success) {
        this.reload.next();
        this._snackBar.open('Pomyślnie zmieniono serwis', 'zamknij', {
          duration: 5000,
          panelClass: 'xxx-alert-info',
        });
      }
    });
  }

  onServiceCreate() {
    const dialogRef = this._dialog.open(CreateServiceDialogComponent, {
      disableClose: true,
      maxWidth: '600px',
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result?.success) {
        this.reload.next();
        this._snackBar.open('Pomyślnie dodano serwis', 'zamknij', {
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
