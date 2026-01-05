import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateNewWeeklyScheduleComponent } from './create-new-weekly-schedule.component';

describe('CreateNewWeeklyScheduleComponent', () => {
  let component: CreateNewWeeklyScheduleComponent;
  let fixture: ComponentFixture<CreateNewWeeklyScheduleComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CreateNewWeeklyScheduleComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CreateNewWeeklyScheduleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
