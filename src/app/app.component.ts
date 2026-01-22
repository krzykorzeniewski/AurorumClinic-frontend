import { Component, inject, OnInit } from '@angular/core';
import { HeaderComponent } from './modules/core/components/header/header.component';
import { FooterComponent } from './modules/core/components/footer/footer.component';
import { RouterOutlet } from '@angular/router';
import { SpinnerComponent } from './modules/core/components/spinner/spinner.component';
import { AuthService } from './modules/core/services/auth.service';
import { ChatService } from './modules/core/services/chat.service';
import { UserRoleMap } from './modules/core/models/auth.model';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [HeaderComponent, RouterOutlet, SpinnerComponent, FooterComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css',
})
export class AppComponent implements OnInit {
  private _authService = inject(AuthService);
  private _chatService = inject(ChatService);

  ngOnInit(): void {
    this._authService.refreshCookies().subscribe({
      next: (user) => {
        if (user && (UserRoleMap.DOCTOR || UserRoleMap.PATIENT)) {
          this._chatService.disconnect();
          this._chatService.connect();
        }
      },
    });
  }
}
