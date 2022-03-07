import { Component, OnInit } from '@angular/core';

export interface selectMonth {
  view: string,
  date: string
}

@Component({
  selector: 'app-work-hours-chart',
  templateUrl: './work-hours-chart.component.html',
  styleUrls: ['./work-hours-chart.component.scss']
})
export class WorkHoursChartComponent implements OnInit {
  selector: selectMonth[] = [];
  selected: string = '';

  constructor() { }

  ngOnInit(): void {
    this.getSelector();
  }

  selectedChange(): void{
    console.log(this.selected);
  }

  getSelector(): void {
    /* For 5 years */
    const maxYears = 5;
    let now = new Date();
    let year = now.getFullYear();
    let month = now.getMonth() + 1;
    for(let i = 0; i < maxYears * 12; i++){
      this.selector.push({
        view: `${year}年${month}月`,
        date: new Date(year, month - 1).toString()
      });
      month = month - 1;
      if(!(month > 0)){
        year = year - 1;
        month = 12;
      }
    }
    this.selected = this.selector[0].date;
  }
}
