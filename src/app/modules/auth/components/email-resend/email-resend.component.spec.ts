import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EmailResendComponent } from './email-resend.component';

describe('EmailResendComponent', () => {
  let component: EmailResendComponent;
  let fixture: ComponentFixture<EmailResendComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EmailResendComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EmailResendComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
