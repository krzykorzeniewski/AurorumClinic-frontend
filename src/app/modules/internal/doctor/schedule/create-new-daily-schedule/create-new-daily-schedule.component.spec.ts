import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateNewDailyScheduleComponent } from './create-new-daily-schedule.component';

describe('CreateNewDailyScheduleComponent', () => {
  let component: CreateNewDailyScheduleComponent;
  let fixture: ComponentFixture<CreateNewDailyScheduleComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CreateNewDailyScheduleComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CreateNewDailyScheduleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
