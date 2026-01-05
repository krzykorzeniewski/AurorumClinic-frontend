import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ScheduleAppointmentsListComponent } from './schedule-appointments-list.component';

describe('ScheduleAppointmentsListComponent', () => {
  let component: ScheduleAppointmentsListComponent;
  let fixture: ComponentFixture<ScheduleAppointmentsListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ScheduleAppointmentsListComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ScheduleAppointmentsListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
