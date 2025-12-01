import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DoctorAppointmentSearchComponent } from './doctor-appointment-search.component';

describe('DoctorAppointmentSearchComponent', () => {
  let component: DoctorAppointmentSearchComponent;
  let fixture: ComponentFixture<DoctorAppointmentSearchComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DoctorAppointmentSearchComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DoctorAppointmentSearchComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
