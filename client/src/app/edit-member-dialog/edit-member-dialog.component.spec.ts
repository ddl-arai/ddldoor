import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditMemberDialogComponent } from './edit-member-dialog.component';

import { AppModule } from '../app.module';

describe('EditMemberDialogComponent', () => {
  let component: EditMemberDialogComponent;
  let fixture: ComponentFixture<EditMemberDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      //declarations: [ EditMemberDialogComponent ]
      imports: [ AppModule ],
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(EditMemberDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
