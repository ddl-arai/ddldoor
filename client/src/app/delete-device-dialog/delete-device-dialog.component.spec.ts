import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DeleteDeviceDialogComponent } from './delete-device-dialog.component';

import { AppModule } from '../app.module';

describe('DeleteDeviceDialogComponent', () => {
  let component: DeleteDeviceDialogComponent;
  let fixture: ComponentFixture<DeleteDeviceDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      //declarations: [ DeleteDeviceDialogComponent ]
      imports: [ AppModule ],
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DeleteDeviceDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
