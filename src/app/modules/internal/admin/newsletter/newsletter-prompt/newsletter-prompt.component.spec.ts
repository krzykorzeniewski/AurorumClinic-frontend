import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NewsletterPromptComponent } from './newsletter-prompt.component';

describe('NewsletterPromptComponent', () => {
  let component: NewsletterPromptComponent;
  let fixture: ComponentFixture<NewsletterPromptComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NewsletterPromptComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(NewsletterPromptComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
