import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditPhoneDialogComponent } from './edit-phone-dialog.component';

describe('EditPhoneDialogComponent', () => {
  let component: EditPhoneDialogComponent;
  let fixture: ComponentFixture<EditPhoneDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EditPhoneDialogComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EditPhoneDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
