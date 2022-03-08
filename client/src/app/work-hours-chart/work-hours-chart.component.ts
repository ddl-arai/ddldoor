import { Component, OnInit } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { member } from '../models/member';
import { DbService } from '../db.service';

export interface selectMonth {
  view: string,
  date: Date
}

export interface displayData {
  date: string,
  info: string[]
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
  names: string[] = [];

  constructor(
    private dbService: DbService
  ) { }

  ngOnInit(): void {
    this.getSelector();
    //this.getDisplayColumns();
    this.getDate();
    this.getTableData();
  }

  selectedChange(): void {
    this.init();
    this.getDate();
    this.getTableData();
  }

  init(): void {
    this.dates = [];
    this.dataSource.data = [];
    this.displayedColumns = [];
    this.names = [];
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

  getDisplayColumns(): void {
    this.displayedColumns.push('date');
    this.dbService.getAll<member>('members')
    .subscribe(members => {
      members.forEach(member => {
        this.displayedColumns.push(member.name);
      });
    });
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
    this.dbService.getWorkHours([], this.dates[0].date.toString(), this.dates[this.dates.length - 1].date.toString(), 30)
    .subscribe(workHourses => {

      this.displayedColumns.push('date');
      for(let workHours of workHourses){
        if(!this.displayedColumns.includes(workHours.name)){
          this.displayedColumns.push(workHours.name);
          this.names.push(workHours.name);
        }
      }

      let displayWorkHours: displayData[] = [];
      for(let date of this.dates){
        let extracted = workHourses.filter(workHours => {
          const workHoursDate = new Date(workHours.date);
          return date.date.getFullYear() === workHoursDate.getFullYear() && date.date.getMonth() === workHoursDate.getMonth() && date.date.getDate() === workHoursDate.getDate()
        });
        console.log(extracted);
        let info: string[] = [];
        if(extracted.length !== 0){
          console.log(this.names)
          for(let name of this.names){
            console.log(name);
            let text: string = '';
            let workHours = extracted.find(el => el.name === name);
            if(workHours){
              if(workHours.start && workHours.end){
                let hours: string;
                if(workHours.hours.slice(-2) == '00'){
                  hours = `${workHours.hours.slice(0,2)}`;
                }
                else{
                  hours = `${workHours.hours.slice(0,2)}.5`;
                }
                text = `退勤<br>(${workHours.start}～${workHours.end})<br>【実務】${hours}時間`;
              }
              else if(workHours.start && !workHours.end){
                text = `出勤<br>(${workHours.start}～)`;
              }
            }
            console.log(text);
            info.push(text);
          }
        }
        else{
          info = new Array<string>(this.names.length);
          info.fill('');
        }
        console.log(info);
        displayWorkHours.push({
          date: date.view,
          info: info
        });
        console.log(displayWorkHours);
      }
      this.dataSource.data = displayWorkHours;
      console.log(this.dataSource.data);
    });
  }
}
