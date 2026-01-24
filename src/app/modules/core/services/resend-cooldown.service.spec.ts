import { TestBed } from '@angular/core/testing';

import { ResendCooldownService } from './resend-cooldown.service';

describe('ResendCooldownService', () => {
  let service: ResendCooldownService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ResendCooldownService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
