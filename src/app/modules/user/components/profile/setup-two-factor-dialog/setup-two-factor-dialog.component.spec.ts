import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SetupTwoFactorDialogComponent } from './setup-two-factor-dialog.component';

describe('SetupTwoFactorDialogComponent', () => {
  let component: SetupTwoFactorDialogComponent;
  let fixture: ComponentFixture<SetupTwoFactorDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SetupTwoFactorDialogComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SetupTwoFactorDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
