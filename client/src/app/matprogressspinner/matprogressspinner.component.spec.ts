import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MatprogressspinnerComponent } from './matprogressspinner.component';

describe('MatprogressspinnerComponent', () => {
  let component: MatprogressspinnerComponent;
  let fixture: ComponentFixture<MatprogressspinnerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MatprogressspinnerComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MatprogressspinnerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
