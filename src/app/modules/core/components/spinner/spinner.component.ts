import { Component, inject } from '@angular/core';
import { MatProgressSpinner } from '@angular/material/progress-spinner';
import { SpinnerService } from '../../services/spinner.service';
import { AsyncPipe, NgIf } from '@angular/common';

@Component({
  selector: 'app-spinner',
  imports: [
    MatProgressSpinner,
    AsyncPipe,
    NgIf
  ],
  templateUrl: './spinner.component.html',
  styleUrl: './spinner.component.css'
})
export class SpinnerComponent {
  private _spinnerService = inject(SpinnerService);
  isLoading = this._spinnerService.isLoading;
}
