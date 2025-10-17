import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DoctorAppointmentCardComponent } from './doctor-appointment-card.component';

describe('DoctorAppointmentCardComponent', () => {
  let component: DoctorAppointmentCardComponent;
  let fixture: ComponentFixture<DoctorAppointmentCardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DoctorAppointmentCardComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DoctorAppointmentCardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
