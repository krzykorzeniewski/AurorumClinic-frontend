import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DoctorScheduleAppointmentsListComponent } from './doctor-schedule-appointments-list.component';

describe('DoctorScheduleAppointmentsListComponent', () => {
  let component: DoctorScheduleAppointmentsListComponent;
  let fixture: ComponentFixture<DoctorScheduleAppointmentsListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DoctorScheduleAppointmentsListComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DoctorScheduleAppointmentsListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
