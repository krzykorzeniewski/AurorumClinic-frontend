import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SpinnerService {
  isLoading = new BehaviorSubject<boolean>(false);

  showSpinner() {
    this.isLoading.next(true);
  }

  hideSpinner() {
    this.isLoading.next(false);
  }
}
