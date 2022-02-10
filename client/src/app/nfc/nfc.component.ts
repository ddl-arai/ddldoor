import { Component, OnInit } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatDialog } from '@angular/material/dialog';
import { DbService } from '../db.service';
import { card } from '../models/card';
import { member } from '../models/member';
import { CardDialogComponent } from '../card-dialog/card-dialog.component';


export interface displayData {
	id: number,
	name: string,
	idm: string,
	enable: string, // 有効 or 無効
	expire: string, // yyyy/mm/dd
	remark: string,
}
 
@Component({
  selector: 'app-nfc',
  templateUrl: './nfc.component.html',
  styleUrls: ['./nfc.component.scss']
})
export class NfcComponent implements OnInit {
	displayedColumns: string[] = [
		'id',
		'name',
		'idm',
		'enable',
		'expire',
		'remark',
		'edit'
	];
	dataSource = new MatTableDataSource<displayData>();

	constructor(
		private dbService: DbService,
    	private snackBar: MatSnackBar,
    	public dialog: MatDialog,
	) { 
	}

	ngOnInit(): void {
		this.getCards();
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
					if(card.enable){
						enable = '有効';
					}
					else{
						enable = '無効';
					}
					member = members.find(m => m.id === card.id);
					if(member !== undefined){
						let expire = new Date(card.expire);
						displayCards.push({
							idm: card.idm,
							id: card.id,
							name:  member.name,
							enable: enable,
							expire: `${expire.getFullYear()}/${('0' + (expire.getMonth() + 1).toString()).slice(-2)}/${('0' + expire.getDay().toString()).slice(-2)}`,
							remark: card.remark
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
			height: '600px'
		});
		dialogRef.afterClosed().subscribe(() => {
			this.ngOnInit();
		});
	}

	onEdit(idm: string): void {

	}
}
