import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TutrialModalComponent } from './tutrial-modal.component';

describe('TutrialModalComponent', () => {
  let component: TutrialModalComponent;
  let fixture: ComponentFixture<TutrialModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TutrialModalComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TutrialModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
