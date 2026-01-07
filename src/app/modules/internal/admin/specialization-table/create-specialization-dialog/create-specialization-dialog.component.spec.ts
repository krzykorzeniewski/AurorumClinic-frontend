import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateSpecializationDialogComponent } from './create-specialization-dialog.component';

describe('CreateSpecializationDialogComponent', () => {
  let component: CreateSpecializationDialogComponent;
  let fixture: ComponentFixture<CreateSpecializationDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CreateSpecializationDialogComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CreateSpecializationDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
