import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StampDialogComponent } from './stamp-dialog.component';

import { AppModule } from '../app.module';

describe('StampDialogComponent', () => {
  let component: StampDialogComponent;
  let fixture: ComponentFixture<StampDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      //declarations: [ StampDialogComponent ]
      imports: [ AppModule ],
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(StampDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
