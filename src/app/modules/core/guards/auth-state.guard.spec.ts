import { TestBed } from '@angular/core/testing';
import { CanActivateFn } from '@angular/router';

import { authStateGuard } from './auth-state.guard';

describe('authStateGuard', () => {
  const executeGuard: CanActivateFn = (...guardParameters) => 
      TestBed.runInInjectionContext(() => authStateGuard(...guardParameters));

  beforeEach(() => {
    TestBed.configureTestingModule({});
  });

  it('should be created', () => {
    expect(executeGuard).toBeTruthy();
  });
});
