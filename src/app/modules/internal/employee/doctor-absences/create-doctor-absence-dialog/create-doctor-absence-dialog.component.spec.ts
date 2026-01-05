import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateDoctorAbsenceDialogComponent } from './create-doctor-absence-dialog.component';

describe('CreateDoctorAbsenceDialogComponent', () => {
  let component: CreateDoctorAbsenceDialogComponent;
  let fixture: ComponentFixture<CreateDoctorAbsenceDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CreateDoctorAbsenceDialogComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CreateDoctorAbsenceDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
