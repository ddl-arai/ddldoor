import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WorkHoursChartComponent } from './work-hours-chart.component';

import { AppModule } from '../app.module';

describe('WorkHoursChartComponent', () => {
  let component: WorkHoursChartComponent;
  let fixture: ComponentFixture<WorkHoursChartComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      //declarations: [ WorkHoursChartComponent ]
      imports: [ AppModule ],
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(WorkHoursChartComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
