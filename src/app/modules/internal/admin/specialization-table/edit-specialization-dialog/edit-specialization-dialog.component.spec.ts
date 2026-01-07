import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditSpecializationDialogComponent } from './edit-specialization-dialog.component';

describe('EditSpecializationDialogComponent', () => {
  let component: EditSpecializationDialogComponent;
  let fixture: ComponentFixture<EditSpecializationDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EditSpecializationDialogComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EditSpecializationDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
