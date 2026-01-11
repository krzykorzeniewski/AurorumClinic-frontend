import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SpecializationTableComponent } from './specialization-table.component';

describe('SpecializationTableComponent', () => {
  let component: SpecializationTableComponent;
  let fixture: ComponentFixture<SpecializationTableComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SpecializationTableComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SpecializationTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
