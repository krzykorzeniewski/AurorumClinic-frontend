import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DeleteTwoFactorDialogComponent } from './delete-two-factor-dialog.component';

describe('DeleteTwoFactorDialogComponent', () => {
  let component: DeleteTwoFactorDialogComponent;
  let fixture: ComponentFixture<DeleteTwoFactorDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DeleteTwoFactorDialogComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DeleteTwoFactorDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
