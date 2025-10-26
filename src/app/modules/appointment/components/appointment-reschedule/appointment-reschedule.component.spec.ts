import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AppointmentRescheduleComponent } from './appointment-reschedule.component';

describe('AppointmentRescheduleComponent', () => {
  let component: AppointmentRescheduleComponent;
  let fixture: ComponentFixture<AppointmentRescheduleComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AppointmentRescheduleComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AppointmentRescheduleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
