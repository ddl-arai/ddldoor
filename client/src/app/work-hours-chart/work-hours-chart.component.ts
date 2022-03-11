import { Component, OnInit } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { DbService } from '../db.service';
import { SpinnerService } from '../spinner.service';

export interface selectMonth {
  view: string,
  date: Date
}

export interface displayData {
  [key: string]: string
}

export interface dynamicColumn {
  view: string,
  def: string
}

export interface calcSet {
  sumMonth: displayData,
  s_number: number[],
  workDate: displayData,
  w_number: number[],
  overtimeHours: displayData
  o_number: number[]
}

@Component({
  selector: 'app-work-hours-chart',
  templateUrl: './work-hours-chart.component.html',
  styleUrls: ['./work-hours-chart.component.scss']
})
export class WorkHoursChartComponent implements OnInit {
  selector: selectMonth[] = [];
  selected: Date = new Date();
  dataSource = new MatTableDataSource<displayData>();
  displayedColumns: string[] = [];
  dates: selectMonth[] = [];
  dynamicColumns: dynamicColumn[] = [];

  constructor(
    private dbService: DbService,
    private spinnerService: SpinnerService
  ) { }

  ngOnInit(): void {
    this.getSelector();
    this.getTableData();
  }

  selectedChange(): void {
    this.init();
    this.getTableData();
  }

  init(): void {
    this.dates = [];
    this.dataSource.data = [];
    this.displayedColumns = [];
    this.dynamicColumns = [];
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
        date: new Date(year, month - 1)
      });
      month = month - 1;
      if(!(month > 0)){
        year = year - 1;
        month = 12;
      }
    }
    this.selected = this.selector[0].date;
  }

  getDate(): void {
    for(let i = 0; i < new Date(this.selected.getFullYear(), this.selected.getMonth() + 1, 0).getDate(); i++){
      let date = new Date(this.selected.getFullYear(), this.selected.getMonth(), i + 1);
      let day: string = '';
      switch(date.getDay()){
        case 0:
          day = '日';
          break;
        case 1:
          day = '月';
          break;
        case 2:
          day = '火';
          break;
        case 3:
          day = '水';
          break;
        case 4:
          day = '木';
          break;
        case 5:
          day = '金';
          break;
        case 6:
          day = '土';
          break;
        default:
          break;
      }
      this.dates.push({
        view: `${date.getDate()} (${day})`,
        date: date
      });
    } 
  }

  getTableData(): void {
    this.spinnerService.attach();
    this.getDate();
    this.dbService.getWorkHours([], this.dates[0].date.toString(), this.dates[this.dates.length - 1].date.toString(), 30)
    .subscribe(workHourses => {

      /* Make column */
      let kinds: string[] = [];
      for(let workHours of workHourses){
        if(!kinds.includes(workHours.name)){
          kinds.push(workHours.name);
        }
      }
      this.dynamicColumns.push({
        view: '日付',
        def: 'date'
      });
      for(let i = 0; i < kinds.length; i++){
        this.dynamicColumns.push({
          view: kinds[i],
          def: String(i)
        });
      }
      this.displayedColumns = this.dynamicColumns.map(el => el.def);
      this.dynamicColumns.shift();

      /* Make data */
      let displayWorkHours: displayData[] = [];
      let calcSet: calcSet = {
        sumMonth: {},
        s_number: new Array<number>(kinds.length),
        workDate: {},
        w_number: new Array<number>(kinds.length),
        overtimeHours: {},
        o_number: new Array<number>(kinds.length)
      }
      calcSet.sumMonth['date'] = '月総計';
      calcSet.workDate['date'] = '出勤日数';
      calcSet.overtimeHours['date'] = '残業目安';
      calcSet.s_number.fill(0);
      calcSet.w_number.fill(0);
      calcSet.o_number.fill(0);

      for(let date of this.dates){
        let object: displayData = {};
        object['date'] = date.view;
        let extracted = workHourses.filter(workHours => {
          const workHoursDate = new Date(workHours.date);
          return date.date.getFullYear() === workHoursDate.getFullYear() && date.date.getMonth() === workHoursDate.getMonth() && date.date.getDate() === workHoursDate.getDate()
        });

        if(extracted.length !== 0){
          for(let i = 0; i < kinds.length; i++){
            let text: string = '';
            let workHours = extracted.find(el => el.name === kinds[i]);
            if(workHours){
              if(workHours.start && workHours.end){
                calcSet.w_number[i] += 1;
                let hours: string;
                if(workHours.hours.slice(-2) == '00'){
                  hours = `${workHours.hours.slice(0,2)}`;
                }
                else{
                  hours = `${workHours.hours.slice(0,2)}.5`;
                }
                calcSet.s_number[i] += Number(hours) - 1;
                text = `退勤<br>(${workHours.start}～${workHours.end})<br>【実務】${Number(hours) - 1}時間`;
                calcSet.o_number[i] += (Number(hours) - 1) - 8;
              }
              else if(workHours.start && !workHours.end){
                text = `出勤<br>(${workHours.start}～)`;
              }
            }
            object[`${i}`] = text;
          }
        }
        displayWorkHours.push(object);
      }
      /* Calc information */
      for(let i = 0; i < kinds.length; i++){
        calcSet.sumMonth[`${i}`] = `${calcSet.s_number[i]}時間`;
        calcSet.workDate[`${i}`] = `${calcSet.w_number[i]}日`;
        calcSet.overtimeHours[`${i}`] = `${calcSet.o_number[i]}時間`;
      }
      displayWorkHours.push(calcSet.sumMonth);
      displayWorkHours.push(calcSet.workDate);
      displayWorkHours.push(calcSet.overtimeHours);

      this.dataSource.data = displayWorkHours;
      this.spinnerService.detach();
    });
  }
}