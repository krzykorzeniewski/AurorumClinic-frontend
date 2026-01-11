import {
  AfterViewInit,
  Component,
  ElementRef,
  inject,
  OnDestroy,
  OnInit,
} from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import {
  NgClass,
  NgIf,
  NgOptimizedImage,
  NgSwitch,
  NgSwitchCase,
} from '@angular/common';
import { User, UserRoleMap } from '../../models/auth.model';
import { Subscription } from 'rxjs';
import { AuthService } from '../../services/auth.service';
import { NavigationEnd, Router, RouterLink } from '@angular/router';
import { ChatService } from '../../services/chat.service';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [
    MatIconModule,
    NgClass,
    NgIf,
    RouterLink,
    NgOptimizedImage,
    NgSwitch,
    NgSwitchCase,
  ],
  templateUrl: './header.component.html',
  styleUrl: './header.component.css',
})
export class HeaderComponent implements OnInit, AfterViewInit, OnDestroy {
  private _authService = inject(AuthService);
  private _sub!: Subscription;
  private _router = inject(Router);
  private _element = inject(ElementRef);
  private _chatService = inject(ChatService);
  private _routeSub?: Subscription;
  user: User | null | undefined = undefined;
  isLargeScreen = false;

  ngOnInit(): void {
    this.checkScreen();
    window.addEventListener('resize', () => this.checkScreen());
    this._sub = this._authService.user$.subscribe((user) => (this.user = user));
  }

  ngAfterViewInit(): void {
    this._routeSub = this._router.events.subscribe((event) => {
      if (event instanceof NavigationEnd) {
        const dropdownToggle = this._element.nativeElement.querySelector(
          '#accountDropdownUser',
        );
        const dropdownMenu = this._element.nativeElement.querySelector(
          '.dropdown-menu.show',
        );

        if (dropdownToggle && dropdownMenu) {
          dropdownMenu.classList.remove('show');
          const parent = dropdownToggle.closest('.dropdown');
          if (parent?.classList.contains('show')) {
            parent.classList.remove('show');
          }

          dropdownToggle.setAttribute('aria-expanded', 'false');
        }

        const navbarCollapse = this._element.nativeElement.querySelector(
          '#navbarSupportedContent',
        );
        if (navbarCollapse?.classList.contains('show')) {
          navbarCollapse.classList.remove('show');
        }
      }
    });
  }

  get userRole() {
    return this._authService.userRole;
  }

  checkScreen(): void {
    this.isLargeScreen = window.innerWidth >= 992;
  }

  logout() {
    this._authService.logout().subscribe({
      next: () => {
        this._chatService.disconnect();
        void this._router.navigate(['']);
      },
    });
  }

  ngOnDestroy(): void {
    if (this._sub) this._sub.unsubscribe();
    if (this._routeSub) this._routeSub.unsubscribe();
  }

  protected readonly UserRole = UserRoleMap;
}
