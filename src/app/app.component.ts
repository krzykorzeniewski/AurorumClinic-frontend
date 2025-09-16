import { Component, inject, OnInit } from '@angular/core';
import { HeaderComponent } from './modules/core/components/header/header.component';
import { FooterComponent } from './modules/core/components/footer/footer.component';
import { RouterOutlet } from '@angular/router';
import { SpinnerComponent } from './modules/core/components/spinner/spinner.component';
import { AuthService } from './modules/core/services/auth.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [HeaderComponent, RouterOutlet, SpinnerComponent, FooterComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css',
})
export class AppComponent implements OnInit {
  private _authService = inject(AuthService);

  ngOnInit(): void {
    this._authService.refreshCookies().subscribe();
  }
}
