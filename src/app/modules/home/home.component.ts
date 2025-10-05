import { Component, inject, OnInit } from '@angular/core';
import {
  MatFormField,
  MatInput,
  MatLabel,
  MatPrefix,
} from '@angular/material/input';
import { MatButton } from '@angular/material/button';
import { ReactiveFormsModule } from '@angular/forms';
import { MatIcon } from '@angular/material/icon';
import { NgForOf } from '@angular/common';
import { DoctorCardComponent } from '../shared/components/doctor-card/doctor-card.component';
import { DoctorRecommended } from '../core/models/user.model';
import { DoctorService } from '../core/services/doctor.service';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [
    MatInput,
    MatFormField,
    MatLabel,
    ReactiveFormsModule,
    MatButton,
    MatIcon,
    MatPrefix,
    NgForOf,
    DoctorCardComponent,
  ],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css',
})
export class HomeComponent implements OnInit {
  private _doctorService = inject(DoctorService);
  recommendedDoctors: DoctorRecommended[] = [];

  ngOnInit(): void {
    this._doctorService.getRecommendedDoctors(0, 6).subscribe({
      next: (res) => {
        this.recommendedDoctors = res;
      },
    });
  }
}
