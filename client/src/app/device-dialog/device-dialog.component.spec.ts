import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DeviceDialogComponent } from './device-dialog.component';

import { AppModule } from '../app.module';

describe('DeviceDialogComponent', () => {
  let component: DeviceDialogComponent;
  let fixture: ComponentFixture<DeviceDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      //declarations: [ DeviceDialogComponent ]
      imports: [ AppModule ],
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DeviceDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
