import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ResetInitComponent } from './reset-init.component';

describe('ResetInitComponent', () => {
  let component: ResetInitComponent;
  let fixture: ComponentFixture<ResetInitComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ResetInitComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ResetInitComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
