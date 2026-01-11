import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateNewsletterDialogComponent } from './create-newsletter-dialog.component';

describe('CreateNewsletterDialogComponent', () => {
  let component: CreateNewsletterDialogComponent;
  let fixture: ComponentFixture<CreateNewsletterDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CreateNewsletterDialogComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CreateNewsletterDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
