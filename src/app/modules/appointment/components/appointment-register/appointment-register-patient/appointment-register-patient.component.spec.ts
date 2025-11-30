import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AppointmentRegisterPatientComponent } from './appointment-register-patient.component';

describe('AppointmentRegisterPatientComponent', () => {
  let component: AppointmentRegisterPatientComponent;
  let fixture: ComponentFixture<AppointmentRegisterPatientComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AppointmentRegisterPatientComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AppointmentRegisterPatientComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
