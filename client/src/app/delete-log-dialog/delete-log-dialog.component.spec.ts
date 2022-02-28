import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DeleteLogDialogComponent } from './delete-log-dialog.component';

describe('DeleteLogDialogComponent', () => {
  let component: DeleteLogDialogComponent;
  let fixture: ComponentFixture<DeleteLogDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DeleteLogDialogComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DeleteLogDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
