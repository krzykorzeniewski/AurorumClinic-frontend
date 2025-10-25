import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AppointmentsDetailsComponent } from './appointments-details.component';

describe('AppointmentsDetailsComponent', () => {
  let component: AppointmentsDetailsComponent;
  let fixture: ComponentFixture<AppointmentsDetailsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AppointmentsDetailsComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(AppointmentsDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
