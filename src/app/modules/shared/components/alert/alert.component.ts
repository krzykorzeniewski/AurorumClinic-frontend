import { Component, input } from '@angular/core';

export type AlertVariant =
  | 'warning'
  | 'success'
  | 'primary'
  | 'secondary'
  | 'danger'
  | 'info'
  | 'light'
  | 'dark';

@Component({
  selector: 'app-alert',
  standalone: true,
  imports: [],
  templateUrl: './alert.component.html',
  styleUrl: './alert.component.css',
})
export class AlertComponent {
  text = input<string>('');
  variant = input<AlertVariant>('warning');
}
