import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WorkHoursComponent } from './work-hours.component';

import { AppModule } from '../app.module';

describe('WorkHoursComponent', () => {
  let component: WorkHoursComponent;
  let fixture: ComponentFixture<WorkHoursComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      //declarations: [ WorkHoursComponent ]
      imports: [ AppModule ],
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(WorkHoursComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
