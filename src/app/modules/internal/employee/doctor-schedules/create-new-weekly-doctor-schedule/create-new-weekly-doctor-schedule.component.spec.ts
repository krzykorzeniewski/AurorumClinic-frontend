import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateNewWeeklyDoctorScheduleComponent } from './create-new-weekly-doctor-schedule.component';

describe('CreateNewWeeklyDoctorScheduleComponent', () => {
  let component: CreateNewWeeklyDoctorScheduleComponent;
  let fixture: ComponentFixture<CreateNewWeeklyDoctorScheduleComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CreateNewWeeklyDoctorScheduleComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CreateNewWeeklyDoctorScheduleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
