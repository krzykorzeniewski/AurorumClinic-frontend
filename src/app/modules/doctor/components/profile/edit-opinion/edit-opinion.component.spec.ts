import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditOpinionComponent } from './edit-opinion.component';

describe('EditOpinionComponent', () => {
  let component: EditOpinionComponent;
  let fixture: ComponentFixture<EditOpinionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EditOpinionComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EditOpinionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
