import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AppointmentRegisterEmployeeComponent } from './appointment-register-employee.component';

describe('AppointmentRegisterEmployeeComponent', () => {
  let component: AppointmentRegisterEmployeeComponent;
  let fixture: ComponentFixture<AppointmentRegisterEmployeeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AppointmentRegisterEmployeeComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AppointmentRegisterEmployeeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
