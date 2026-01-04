import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ScheduleDetailsComponent } from './schedule-details.component';

describe('ScheduleDetailsComponent', () => {
  let component: ScheduleDetailsComponent;
  let fixture: ComponentFixture<ScheduleDetailsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ScheduleDetailsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ScheduleDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
