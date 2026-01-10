import {
  AfterViewInit,
  Component,
  inject,
  OnDestroy,
  ViewChild,
} from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
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
import {
  debounceTime,
  distinctUntilChanged,
  map,
  merge,
  startWith,
  Subscription,
  switchMap,
} from 'rxjs';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort, MatSortHeader } from '@angular/material/sort';
import { UserService } from '../../../../core/services/user.service';
import { MatFormField, MatInput, MatLabel } from '@angular/material/input';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { MatOption, MatSelect } from '@angular/material/select';
import { GetUserApiResponse } from '../../../../core/models/user.model';
import { DatePipe, Location, NgIf } from '@angular/common';
import { UserRole } from '../../../../core/models/auth.model';
import { AuthService } from '../../../../core/services/auth.service';

@Component({
  selector: 'app-user-table',
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
    MatSortHeader,
    MatTable,
    MatHeaderCellDef,
    MatInput,
    ReactiveFormsModule,
    MatNoDataRow,
    MatFormField,
    MatLabel,
    MatSelect,
    MatOption,
    DatePipe,
    NgIf,
  ],
  templateUrl: './user-table.component.html',
  styleUrl: './user-table.component.css',
})
export class UserTableComponent implements AfterViewInit, OnDestroy {
  protected readonly UserRole = UserRole;
  private _authService = inject(AuthService);
  private _userService = inject(UserService);
  private _snackBar = inject(MatSnackBar);
  private _location = inject(Location);
  private _router = inject(Router);
  displayedColumns: string[] = [
    'name',
    'surname',
    'pesel',
    'birthDate',
    'email',
    'phoneNumber',
    'createdAt',
    'update',
    'passwordReset',
    'doctorProfile',
  ];
  dataSource!: MatTableDataSource<GetUserApiResponse>;
  totalCount = 0;
  filterValue = new FormControl('', { nonNullable: true });
  userType = new FormControl(null);
  sub = new Subscription();
  userTypes = [
    { key: null, label: 'Wszyscy' },
    { key: 'DOCTOR', label: 'Doktor' },
    { key: 'EMPLOYEE', label: 'Pracownik' },
    { key: 'PATIENT', label: 'Pacjent' },
  ];

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
    this._location.replaceState(this._router.url);
  }

  ngAfterViewInit(): void {
    this.sort.sortChange.subscribe(() => (this.paginator.pageIndex = 0));

    this.sub.add(
      merge(
        this.sort.sortChange,
        this.paginator.page,
        this.filterValue.valueChanges.pipe(
          debounceTime(800),
          distinctUntilChanged(),
        ),
        this.userType.valueChanges.pipe(distinctUntilChanged()),
      )
        .pipe(
          startWith({}),
          switchMap(() => {
            return this._userService.getAllUsers(
              this.paginator.pageIndex,
              this.paginator.pageSize,
              this.sort.active,
              this.sort.direction,
              this.userType.getRawValue(),
              this.filterValue.getRawValue()?.trim(),
            );
          }),
          map((response) => {
            this.totalCount = response.page.totalElements;
            return response.users;
          }),
        )
        .subscribe((users) => {
          this.dataSource = new MatTableDataSource(users);
        }),
    );

    this.filterValue.valueChanges.subscribe(() => {
      this.paginator.pageIndex = 0;
    });

    this.userType.valueChanges.subscribe(() => {
      this.paginator.pageIndex = 0;
    });
  }

  onPasswordReset(staffId: number) {
    this._authService.createNewPasswordStaff(staffId).subscribe({
      next: () => {
        this._snackBar.open('Pomyślnie wysłano nowe hasło', 'zamknij', {
          duration: 5000,
          panelClass: 'xxx-alert-info',
        });
      },
      error: (err) => {
        this._snackBar.open(err.message, 'zamknij', {
          duration: 5000,
          panelClass: 'xxx-alert-error',
        });
      },
    });
  }

  onUpdate(userId: number, role: UserRole) {
    switch (role) {
      case UserRole.ADMIN:
      case UserRole.EMPLOYEE:
        void this._router.navigate(['/internal/users/update-user'], {
          state: {
            userId: userId,
            role: role,
          },
        });
        break;
      case UserRole.DOCTOR:
        void this._router.navigate(['/internal/users/update-doctor'], {
          state: {
            userId: userId,
          },
        });
        break;
      case UserRole.PATIENT:
        void this._router.navigate(['/internal/users/update-patient'], {
          state: {
            userId: userId,
          },
        });
        break;
      default:
        void this._router.navigate(['/internal/dashboard']);
    }
  }

  onEmployeeRegister() {
    void this._router.navigate(['/internal/users/register-employee']);
  }

  onDoctorRegister() {
    void this._router.navigate(['/internal/users/register-doctor']);
  }

  onDoctorProfile(doctorId: number) {
    void this._router.navigate(['/doctor/profile'], {
      state: {
        doctorId: doctorId,
      },
    });
  }

  ngOnDestroy(): void {
    this.sub.unsubscribe();
  }
}
