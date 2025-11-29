import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AppointmentReschedulePatientComponent } from './appointment-reschedule-patient.component';

describe('AppointmentReschedulePatientComponent', () => {
  let component: AppointmentReschedulePatientComponent;
  let fixture: ComponentFixture<AppointmentReschedulePatientComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AppointmentReschedulePatientComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AppointmentReschedulePatientComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
