import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DeleteMemberDialogComponent } from './delete-member-dialog.component';

import { AppModule } from '../app.module';

describe('DeleteMemberDialogComponent', () => {
  let component: DeleteMemberDialogComponent;
  let fixture: ComponentFixture<DeleteMemberDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      //declarations: [ DeleteMemberDialogComponent ]
      imports: [ AppModule ],
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DeleteMemberDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
