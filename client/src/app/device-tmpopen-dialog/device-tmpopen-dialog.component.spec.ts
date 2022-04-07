import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DeviceTmpopenDialogComponent } from './device-tmpopen-dialog.component';

import { AppModule } from '../app.module';

describe('DeviceTmpopenDialogComponent', () => {
  let component: DeviceTmpopenDialogComponent;
  let fixture: ComponentFixture<DeviceTmpopenDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      //declarations: [ DeviceTmpopenDialogComponent ]
      imports: [ AppModule ],
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
