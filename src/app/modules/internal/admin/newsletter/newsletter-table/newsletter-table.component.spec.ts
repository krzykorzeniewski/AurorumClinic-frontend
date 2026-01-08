import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NewsletterTableComponent } from './newsletter-table.component';

describe('NewsletterTableComponent', () => {
  let component: NewsletterTableComponent;
  let fixture: ComponentFixture<NewsletterTableComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NewsletterTableComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(NewsletterTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
