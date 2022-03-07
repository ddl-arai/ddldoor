import { Component, OnInit, ViewChild, AfterViewInit} from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { DbService } from '../db.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { FormGroup, FormControl } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { filter } from '../models/filter';
import { MatExpansionPanel } from '@angular/material/expansion';
import { member } from '../models/member';
import { SpinnerService } from '../spinner.service';

export interface displayData {
  id: number,
  name: string,
  date: string,
  start: string,
  end: string,
  hours: string
}

export interface checkbox {
  id: number,
  name: string,
  checked: boolean
}

export interface options {
  fileName: string
}

export interface roundOption {
  viewValue: string,
  value: number
}

@Component({
  selector: 'app-work-hours',
  templateUrl: './work-hours.component.html',
  styleUrls: ['./work-hours.component.scss']
})
export class WorkHoursComponent implements OnInit, AfterViewInit{
  yesterday: number = 0;
  filter: filter = {
    ids: [],
    start: 0,
    end: 0,
    roundMin: 0
  }
  displayedColumns: string[] = [
    'id',
    'name',
    'date',
    'start',
    'end',
    'hours'
  ];
  dataSource = new MatTableDataSource<displayData>();
  options: options = {
    fileName: ''
  }
  checkboxList: checkbox[] = [];
  range = new FormGroup({
    start: new FormControl(),
    end: new FormControl(),
  });
  roundOptions: roundOption[] = [
    {viewValue: 'なし', value: 0},
    {viewValue: '15分', value: 15},
    {viewValue: '30分', value: 30}
  ]
  selectedRound: number = 0;


  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;
  @ViewChild('panel') panel!: MatExpansionPanel;

  constructor(
    private dbService: DbService,
    private snackBar: MatSnackBar,
    public dialog: MatDialog,
    private spinnerService: SpinnerService
  ) { }

  ngOnInit(): void {
    this.yesterday = new Date().setDate(new Date().getDate() - 1);
    this.filter = {
      ids: [],
      start: new Date().setMonth(new Date(this.yesterday).getMonth()),
      end: this.yesterday,
      roundMin: 0
    }
    this.options.fileName = 'ddldoor_workHours';
    this.getMembers();
  }

  ngAfterViewInit(): void {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
    /* Here because of panel.close() */
    this.getWorkHours();
    
  }

  getWorkHours(): void {
    this.spinnerService.attach();
    if(!((this.range.value['start'] && this.range.value['end']) || (!this.range.value['start'] && !this.range.value['end']))){
      this.snackBar.open('正しい範囲を入力してください', '閉じる', {duration: 7000});
      this.spinnerService.detach();
      return;
    }
    let checkedList = this.checkboxList.filter(el => el.checked === true);
    let ids: number[] = [];
    checkedList.forEach(el => {
      ids.push(el.id);
    });
    this.dbService.getWorkHours(ids, String(this.range.value['start']), String(this.range.value['end']), this.selectedRound)
    .subscribe(workHoursArr => {
      let displaylogs: displayData[] = [];
      workHoursArr.forEach(workHours => {
        let date = new Date(workHours.date);
        displaylogs.push({
          id: workHours.id,
          name: workHours.name,
          date:`${date.getFullYear()}/${this.pad(date.getMonth() + 1)}/${this.pad(date.getDate())}`,
          start: workHours.start,
          end: workHours.end,
          hours: workHours.hours
        });
      });
      this.dataSource.data = displaylogs;
      this.panel.close();
      this.spinnerService.detach();
    });
  }

  pad(number: number): string {
    let str: string = `${('0' + String(number)).slice(-2)}`;
    return str;
  }

  getMembers(): void {
    this.dbService.getAll<member>('members')
    .subscribe(members => {
      members.forEach(member => {
        this.checkboxList.push({
          id: member.id,
          name:member.name,
          checked: false
        });
      });
    });
  }

  onRefresh(): void {
    this.ngOnInit();
  }

  getInitWorkHours(): void {
    //this.spinnerService.attach();
    let checkedList = this.checkboxList.filter(el => el.checked === true);
    let ids: number[] = [];
    checkedList.forEach(el => {
      ids.push(el.id);
    });
    this.dbService.getWorkHours(ids, String(this.range.value['start']), String(this.range.value['end']), this.selectedRound)
    .subscribe(workHoursArr => {
      let displaylogs: displayData[] = [];
      workHoursArr.forEach(workHours => {
        let date = new Date(workHours.date);
        displaylogs.push({
          id: workHours.id,
          name: workHours.name,
          date:`${date.getFullYear()}/${this.pad(date.getMonth() + 1)}/${this.pad(date.getDate())}`,
          start: workHours.start,
          end: workHours.end,
          hours: workHours.hours
        });
      });
      this.dataSource.data = displaylogs;
      this.spinnerService.detach();
    });
  }

}
