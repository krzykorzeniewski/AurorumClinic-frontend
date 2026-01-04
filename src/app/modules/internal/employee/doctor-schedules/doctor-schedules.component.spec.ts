import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DoctorSchedulesComponent } from './doctor-schedules.component';

describe('DoctorSchedulesComponent', () => {
  let component: DoctorSchedulesComponent;
  let fixture: ComponentFixture<DoctorSchedulesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DoctorSchedulesComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DoctorSchedulesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
