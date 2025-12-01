import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AppointmentRescheduleEmployeeComponent } from './appointment-reschedule-employee.component';

describe('AppointmentRescheduleEmployeeComponent', () => {
  let component: AppointmentRescheduleEmployeeComponent;
  let fixture: ComponentFixture<AppointmentRescheduleEmployeeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AppointmentRescheduleEmployeeComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AppointmentRescheduleEmployeeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
