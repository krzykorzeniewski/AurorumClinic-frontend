import { TestBed } from '@angular/core/testing';
import { CanActivateFn } from '@angular/router';

import { notLoggedInGuard } from './not-logged-in.guard';

describe('notLoggedInGuard', () => {
  const executeGuard: CanActivateFn = (...guardParameters) => 
      TestBed.runInInjectionContext(() => notLoggedInGuard(...guardParameters));

  beforeEach(() => {
    TestBed.configureTestingModule({});
  });

  it('should be created', () => {
    expect(executeGuard).toBeTruthy();
  });
});
