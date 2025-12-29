import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateAbsenceDialogComponent } from './create-absence-dialog.component';

describe('CreateAbsenceDialogComponent', () => {
  let component: CreateAbsenceDialogComponent;
  let fixture: ComponentFixture<CreateAbsenceDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CreateAbsenceDialogComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CreateAbsenceDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
