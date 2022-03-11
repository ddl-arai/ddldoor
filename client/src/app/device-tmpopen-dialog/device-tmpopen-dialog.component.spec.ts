import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DeviceTmpopenDialogComponent } from './device-tmpopen-dialog.component';

describe('DeviceTmpopenDialogComponent', () => {
  let component: DeviceTmpopenDialogComponent;
  let fixture: ComponentFixture<DeviceTmpopenDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DeviceTmpopenDialogComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DeviceTmpopenDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
