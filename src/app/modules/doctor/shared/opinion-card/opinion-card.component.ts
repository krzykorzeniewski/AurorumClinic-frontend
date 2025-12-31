import { Component, input } from '@angular/core';
import { DatePipe, NgForOf, NgIf } from '@angular/common';
import { MatIcon } from '@angular/material/icon';

@Component({
  selector: 'app-opinion-card',
  standalone: true,
  imports: [DatePipe, MatIcon, NgForOf, NgIf],
  templateUrl: './opinion-card.component.html',
  styleUrl: './opinion-card.component.css',
})
export class OpinionCardComponent {
  patientId = input.required<number>();
  patientName = input.required<string>();
  patientSurname = input.required<string>();
  rating = input.required<number>();
  comment = input.required<string>();
  createdAt = input.required<string>();
  answer = input<string | null>();
  answeredAt = input<string | null>();
  doctorName = input<string>();
  doctorSurname = input<string>();
  doctorPicture = input<string>();
}
