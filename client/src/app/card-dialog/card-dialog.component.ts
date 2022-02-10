import { Component, OnInit } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';
import { DbService } from '../db.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { card } from '../models/card';
import { member } from '../models/member';
import { NFCPortLib, Configuration, DetectionOption } from 'nfc-module';

@Component({
  selector: 'app-card-dialog',
  templateUrl: './card-dialog.component.html',
  styleUrls: ['./card-dialog.component.scss']
})
export class CardDialogComponent implements OnInit {
  card: card = {
    idm: '',
    id: 0,
    enable: true,
    expire: '',
    remark: ''
  }
  scanStatus: number = 0;
  members: member[] = [];
  form!: FormGroup;
  idmControl = new FormControl(null, Validators.required);
  idControl = new FormControl(null, Validators.required);
  remarkControl = new FormControl(null);


  constructor(
    public dialogRef: MatDialogRef<CardDialogComponent>,
    private fb: FormBuilder,
    private dbService: DbService,
    private snackBar: MatSnackBar,
  ) { }

  ngOnInit(): void {
    this.getMembers();
    this.form = this.fb.group({
      idm: this.idmControl,
      id: this.idControl,
      remark: this.remarkControl,
    });
    console.log(this.card.enable);
  }

  getMembers(): void {
    this.dbService.getAll<member>('members')
    .subscribe(members => this.members = members);
  }

  onCancel(): void {
    this.dialogRef.close();
  }

  onSubmit(): void {
    this.card.id = this.form.get('id')?.value;
    this.card.remark = this.form.get('remark')?.value;
    /* Expired after 5 yeas */
    this.card.expire = new Date().setFullYear(new Date().getFullYear() + 5).toString();
    this.dbService.add<card>('card', this.card)
    .subscribe(result => {
      if(result){
        this.dialogRef.close();
      }
      else{
        this.snackBar.open('登録できませんでした', '閉じる', {duration: 7000});
      }
    });

  }

  onScan(): void {
    this.scanStatus = 1;
    this.felica_card()
    .then(() => {
      this.scanStatus = 2;
    });

  }

  async felica_card() {
		console.log('[Reading a FeliCa Card] Begin');

		let lib : any;
   
		try {
			/* create NFCPortLib object */
			lib = new NFCPortLib();

			/* init() */
			let config = new Configuration(500 /* ackTimeout */, 500 /* receiveTimeout */, true /* autoBaudRate*/, true /* autoDeviceSelect */);
			await lib.init(config);

			/* open() */
			await lib.open();
			console.log('deviceName : ' + lib.deviceName);

			/* detectCard (FeliCa Card) */
			let detectOption = new DetectionOption(new Uint8Array([0xff, 0xff]), 0, true, false, null);
			while(this.card.idm===''){
        await lib.detectCard('iso18092', detectOption)
          .then((ret: { systemCode: null; idm: any; pmm: any; }) => {
          if (ret.systemCode == null) {
            console.log('IDm : ' + this._array_tohexs(ret.idm) +
                  '\nPMm : ' + this._array_tohexs(ret.pmm) +
                  '\ntargetCardBaudRate : ' + lib.targetCardBaudRate + 'kbps');
          } else {
            console.log('IDm : ' + this._array_tohexs(ret.idm) +
                  '\nPMm : ' + this._array_tohexs(ret.pmm) +
                  '\nSystemCode : ' + this._array_tohexs(ret.systemCode) +
                  '\ntargetCardBaudRate : ' + lib.targetCardBaudRate + 'kbps');
          }
          this.card.idm = this._array_tohexs(ret.idm);
        }, (error: any) => {
          console.log('retry');
        });
      }

			/* close() */
			await lib.close();
			lib = null;

			console.log('Success');

		} catch(error: any) {
			console.log('Error errorType : ' + error.errorType);
			console.log('      message : ' + error.message);

			if (lib != null) {
				await lib.close();
				lib = null;
			}
		}

		console.log('[Reading a FeliCa Card] End');
		return;
	}

	_def_val(param: undefined | string | number, def: string | number)
	{
		return (param === undefined) ? def : param;
	}

	_array_slice(array: string | any[] | Uint8Array, offset: number, length: any)
	{
		let result: never[];

		length = this._def_val(length, array.length - offset);
		result = [];
		this._array_copy(result, 0, array, offset, length);
		
		return result;
	}

	_bytes2hexs(bytes: any[], sep: string) {
		let str;

		let str_num: any = this._def_val(sep, ' ');

		return bytes.map(function(byte: number) {
			str = byte.toString(16);
			return byte < 0x10 ? '0'+str : str;
		}).join(str_num).toUpperCase();
	}

	_array_tohexs(array: string | any[] | Uint8Array, offset?: number, length?: undefined)
	{
		let temp;

		let offset2:any;
    let length2: any;

    offset2 = this._def_val(offset, 0);
    if(typeof offset2 === 'number'){
		  length2 = this._def_val(length, array.length - offset2);
    }

		temp = this._array_slice(array, offset2, length2 );
		return this._bytes2hexs(temp, '');
	}

	_array_copy(dest: any[] | Uint8Array, dest_offset: number, src: string | any[] | Uint8Array, src_offset: number, length: number)
	{
		let idx;
    let src_offset2: any;
    let length2: any;

		src_offset2 = this._def_val(src_offset, 0);
		length2 = this._def_val(length, src.length);

		for (idx = 0; idx < length2; idx++) {
			dest[dest_offset + idx] = src[src_offset2 + idx];
		}

		return dest;
	}


}
