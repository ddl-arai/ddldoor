import { Component, OnInit, ViewChild, AfterViewInit, OnDestroy } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatDialog } from '@angular/material/dialog';
import { DbService } from '../db.service';
import { card } from '../models/card';
import { member } from '../models/member';
import { CardDialogComponent } from '../card-dialog/card-dialog.component';
import { EditCardDialogComponent } from '../edit-card-dialog/edit-card-dialog.component';
import { DeleteCardDialogComponent } from '../delete-card-dialog/delete-card-dialog.component';
import { MatSort } from '@angular/material/sort';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { Subscription } from 'rxjs';

const COLUMNS = [
	'id',
	'name',
	'idm',
	'enable',
	'expire',
	'remark',
	'banDevids',
	'action'
  ];
  
  const COLUMNS_FOR_MOBILE = [
	'name',
	'idm',
	'action'
  ];

export interface displayData {
	id: number,
	name: string,
	idm: string,
	enable: string, // 有効 or 無効
	expire: string, // yyyy/mm/dd
	remark: string,
	banDevids: string
}
 
@Component({
  selector: 'app-nfc',
  templateUrl: './nfc.component.html',
  styleUrls: ['./nfc.component.scss']
})
export class NfcComponent implements OnInit, AfterViewInit, OnDestroy {
	subscription = new Subscription();
	displayedColumns: string[] = [];
	dataSource = new MatTableDataSource<displayData>();

	@ViewChild(MatSort) sort!: MatSort;

	constructor(
		private dbService: DbService,
    	private snackBar: MatSnackBar,
    	public dialog: MatDialog,
		private breakpointObserver: BreakpointObserver,
	) { 
	}

	ngOnInit(): void {
		this.getCards();
		this.subscription.unsubscribe();
		this.subscription = this.breakpointObserver.observe(Breakpoints.Handset)
		.subscribe(result => {
		if(result.matches){
			this.displayedColumns = COLUMNS_FOR_MOBILE;
		}
		else{
			this.displayedColumns = COLUMNS;
		}
		});
	}

	ngAfterViewInit(): void {
		this.dataSource.sort = this.sort;
	}

	getCards(): void {
		this.dbService.getAll<card>('cards')
		.subscribe(cards => {
			if(cards.length === 0){
				this.snackBar.open('データがありませんでした', '閉じる', {duration: 7000});
				return;
			}
			this.dbService.getAll<member>('members')
			.subscribe(members => {

			
				let displayCards: displayData[] = [];
				cards.forEach(card => {
					let enable: string;
					let member: member | undefined;
					let banDevids: string = '';
					if(card.enable){
						enable = '有効';
					}
					else{
						enable = '無効';
					}
					if(card.banDevids.length !== 0){	
						card.banDevids.forEach(id => {
							banDevids += `${id}, `;
						});
					}
					else{
						banDevids = 'なし, '
					}

					member = members.find(m => m.id === card.id);
					if(member !== undefined){
						let expire = new Date(card.expire);
						displayCards.push({
							idm: card.idm,
							id: card.id,
							name:  member.name,
							enable: enable,
							expire: `${expire.getFullYear()}/${('0' + (expire.getMonth() + 1).toString()).slice(-2)}/${('0' + expire.getDate().toString()).slice(-2)}`,
							remark: card.remark,
							banDevids: banDevids.slice(0, -2)
						});
					}
					else{
						// nothing
					}
				});
				this.dataSource.data = displayCards;
			});
		});
	}

	onRefresh(): void {
		this.ngOnInit();
	}

	onCardRegister(): void {
		let dialogRef = this.dialog.open(CardDialogComponent, {
			width: '400px',
			//minHeight: 'calc(100vh - 64px)'
		});
		dialogRef.afterClosed().subscribe(() => {
			this.ngOnInit();
		});
	}

	onEdit(idm: string): void {
		let dialogRef = this.dialog.open(EditCardDialogComponent, {
			width: '400px',
			data: idm
		});
		dialogRef.afterClosed().subscribe(() => {
			this.ngOnInit();
		});
	}

	onDelete(idm: number): void {
		let dialogRef = this.dialog.open(DeleteCardDialogComponent, {
		  width: '400px',
		  data: idm
		});
		dialogRef.afterClosed().subscribe(() => {
		  this.ngOnInit();
		});
	}

	ngOnDestroy(): void {
		this.subscription.unsubscribe();
	}
}
