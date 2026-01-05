import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DoctorAbsencesComponent } from './doctor-absences.component';

describe('DoctorAbsencesComponent', () => {
  let component: DoctorAbsencesComponent;
  let fixture: ComponentFixture<DoctorAbsencesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DoctorAbsencesComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DoctorAbsencesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
