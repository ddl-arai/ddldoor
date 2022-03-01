import { Component, OnInit, ViewChild, AfterViewInit} from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { DbService } from '../db.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { FormGroup, FormControl } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { SpinnerService } from '../spinner.service';
import { filter } from '../models/filter';
import { MatExpansionPanel } from '@angular/material/expansion';
import { member } from '../models/member';


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
    this.options.fileName = 'ddldoor_workhours';
  }

  ngAfterViewInit(): void {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
    this.getMembers();
    this.getWorkHours();
    
  }

  getWorkHours(): void {
    this.panel.close();
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

}
