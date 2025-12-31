import { Component, inject, signal } from '@angular/core';
import { GetFullDoctorApiResponse } from '../../../core/models/doctor.model';
import { Router } from '@angular/router';
import { DoctorService } from '../../../core/services/doctor.service';
import { DoctorCardComponent } from '../../../shared/components/doctor-card/doctor-card.component';
import { Location, NgIf } from '@angular/common';
import { MatFormField, MatLabel } from '@angular/material/input';
import { MatOptgroup, MatOption, MatSelect } from '@angular/material/select';
import { ReactiveFormsModule } from '@angular/forms';
import { Opinion, OpinionGroup } from '../../../core/models/opinion.model';
import { OpinionService } from '../../../core/services/opinion.service';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { OpinionCardComponent } from '../../shared/opinion-card/opinion-card.component';

@Component({
  selector: 'app-doctor-profile',
  standalone: true,
  imports: [
    DoctorCardComponent,
    NgIf,
    MatFormField,
    MatLabel,
    MatSelect,
    MatOption,
    MatOptgroup,
    ReactiveFormsModule,
    MatPaginator,
    OpinionCardComponent,
  ],
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.css',
})
export class ProfileComponent {
  private _opinionService = inject(OpinionService);
  private _doctorService = inject(DoctorService);
  private _location = inject(Location);
  private _router = inject(Router);
  doctor = signal<GetFullDoctorApiResponse | null>(null);
  opinions = signal<Opinion[]>([]);
  currentPage = signal<number>(0);
  pageSize = signal<number>(10);
  totalElements = signal<number>(0);
  totalPages = signal<number>(0);
  selectedSort = signal<string>('createdAt,desc');
  opinionSortGroup: OpinionGroup[] = [
    {
      name: 'Data',
      sortType: [
        { value: 'createdAt,desc', viewValue: 'Data dodania malejąco' },
        { value: 'createdAt,asc', viewValue: 'Data dodania rosnąco' },
      ],
    },
    {
      name: 'Ocena',
      sortType: [
        { value: 'rating,desc', viewValue: 'Ocena malejąco' },
        { value: 'rating,asc', viewValue: 'Ocena rosnąco' },
      ],
    },
  ];

  constructor() {
    const navigation = this._router.getCurrentNavigation();
    const state = navigation?.extras.state as {
      doctorId: number;
    };
    if (!state?.doctorId) {
      void this._router.navigate(['']);
      return;
    }

    this._doctorService.getDoctorById(state.doctorId).subscribe({
      next: (doctor) => {
        this.doctor.set(doctor);
        this.loadOpinions(state.doctorId);
      },
      error: () => {
        void this._router.navigate(['']);
      },
    });
  }

  loadOpinions(doctorId: number) {
    this._opinionService
      .getDoctorOpinions(
        doctorId,
        this.currentPage(),
        this.pageSize(),
        this.selectedSort(),
      )
      .subscribe({
        next: (response) => {
          this.opinions.set(response.data.content);
          this.totalElements.set(response.data.page.totalElements);
          this.totalPages.set(response.data.page.totalPages);
        },
      });
  }

  sortSelection(sortValue: string): void {
    this.selectedSort.set(sortValue);
    this.currentPage.set(0);
    const doctorId = this.doctor()?.id;
    if (doctorId) {
      this.loadOpinions(doctorId);
    }
  }

  onPageChange(event: PageEvent): void {
    this.currentPage.set(event.pageIndex);
    this.pageSize.set(event.pageSize);
    const doctorId = this.doctor()?.id;
    if (doctorId) {
      this.loadOpinions(doctorId);
    }
  }

  goBack(): void {
    this._location.back();
  }
}
