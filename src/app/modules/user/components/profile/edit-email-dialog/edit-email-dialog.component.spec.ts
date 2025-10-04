import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditEmailDialogComponent } from './edit-email-dialog.component';

describe('EditEmailDialogComponent', () => {
  let component: EditEmailDialogComponent;
  let fixture: ComponentFixture<EditEmailDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EditEmailDialogComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EditEmailDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
