import { Component, inject, OnDestroy, OnInit } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { NgClass, NgIf } from '@angular/common';
import { User } from '../../models/user.model';
import { Subscription } from 'rxjs';
import { AuthService } from '../../services/auth.service';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [MatIconModule, NgClass, NgIf, RouterLink],
  templateUrl: './header.component.html',
  styleUrl: './header.component.css',
})
export class HeaderComponent implements OnInit, OnDestroy {
  private _authService = inject(AuthService);
  private _sub!: Subscription;
  user: User | null = null;
  isLargeScreen = false;


  ngOnInit(): void {
    this.checkScreen();
    window.addEventListener('resize', () => this.checkScreen());
    this._sub = this._authService.user.subscribe({
      next: (user) => this.user = user
      });
  }

  checkScreen(): void {
    this.isLargeScreen = window.innerWidth >= 992;
  }

  logout() {
    this._authService.logout();
  }

  ngOnDestroy(): void {
    if(this._sub) this._sub.unsubscribe();
  }
}
