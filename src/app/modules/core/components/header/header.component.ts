import { AfterViewInit, Component, ElementRef, inject, OnDestroy, OnInit } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { NgClass, NgIf } from '@angular/common';
import { User } from '../../models/user.model';
import { Subscription } from 'rxjs';
import { AuthService } from '../../services/auth.service';
import { NavigationEnd, Router, RouterLink } from '@angular/router';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [MatIconModule, NgClass, NgIf, RouterLink],
  templateUrl: './header.component.html',
  styleUrl: './header.component.css',
})
export class HeaderComponent implements OnInit, AfterViewInit, OnDestroy {
  private _authService = inject(AuthService);
  private _sub!: Subscription;
  private _router = inject(Router);
  private _element = inject(ElementRef);
  private _routeSub?: Subscription;
  user: User | null = null;
  isLargeScreen = false;


  ngOnInit(): void {
    this.checkScreen();
    window.addEventListener('resize', () => this.checkScreen());
    this._sub = this._authService.user$.subscribe(user => this.user = user);
  }

  ngAfterViewInit(): void {
    this._routeSub = this._router.events.subscribe((event) => {
      if (event instanceof NavigationEnd) {
        const dropdownToggle = this._element.nativeElement.querySelector('#accountDropdownUser');
        const dropdownMenu = this._element.nativeElement.querySelector('.dropdown-menu.show');

        if (dropdownToggle && dropdownMenu) {
          dropdownMenu.classList.remove('show');
          const parent = dropdownToggle.closest('.dropdown');
          if (parent?.classList.contains('show')) {
            parent.classList.remove('show');
          }

          dropdownToggle.setAttribute('aria-expanded', 'false');
        }

        const navbarCollapse = this._element.nativeElement.querySelector('#navbarSupportedContent');
        if (navbarCollapse?.classList.contains('show')) {
          navbarCollapse.classList.remove('show');
        }
      }
    });
  }

  checkScreen(): void {
    this.isLargeScreen = window.innerWidth >= 992;
  }

  logout() {
    this._authService.logout().subscribe({
      next: () => {
        void this._router.navigate(['/auth/login']);
      }
    });
  }

  ngOnDestroy(): void {
    if(this._sub) this._sub.unsubscribe();
    if(this._routeSub) this._routeSub.unsubscribe();
  }
}
