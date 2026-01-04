import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateNewDailyDoctorScheduleComponent } from './create-new-daily-doctor-schedule.component';

describe('CreateNewDailyDoctorScheduleComponent', () => {
  let component: CreateNewDailyDoctorScheduleComponent;
  let fixture: ComponentFixture<CreateNewDailyDoctorScheduleComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CreateNewDailyDoctorScheduleComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CreateNewDailyDoctorScheduleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
