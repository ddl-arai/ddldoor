import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditCardDialogComponent } from './edit-card-dialog.component';

import { AppModule } from '../app.module';

describe('EditCardDialogComponent', () => {
  let component: EditCardDialogComponent;
  let fixture: ComponentFixture<EditCardDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      //declarations: [ EditCardDialogComponent ]
      imports: [ AppModule ],
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(EditCardDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
