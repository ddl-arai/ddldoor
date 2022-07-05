import { Component, OnInit, AfterViewInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';
import { DbService } from '../../../services/db.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { card } from '../../../models/card';
import { member } from '../../../models/member';
import { NFCPortLib, Configuration, DetectionOption } from 'nfc-module';
import { device } from '../../../models/device';

export interface viewDev {
  id: number,
  name: string,
  checked: boolean
}

@Component({
  selector: 'app-card-register',
  templateUrl: './card-register.component.html',
  styleUrls: ['./card-register.component.scss']
})
export class CardRegisterComponent implements OnInit, AfterViewInit {
  card: card = {
    idm: '',
    id: 0,
    enable: true,
    expire: '',
    remark: '',
    banDevids: []
  }
  scanStatus: number = 0;
  terminate: boolean = false;
  members: member[] = [];
  form!: FormGroup;
  idmControl = new FormControl(null, Validators.required);
  idControl = new FormControl(null, Validators.required);
  enableControl = new FormControl(true);
  remarkControl = new FormControl(null);
  banDevidsControl = new FormControl(false);
  viewDevs: viewDev[] = [];
  disableAnimation: boolean = true;

  constructor(
    public dialogRef: MatDialogRef<CardRegisterComponent>,
    private fb: FormBuilder,
    private dbService: DbService,
    private snackBar: MatSnackBar,
    @Inject(MAT_DIALOG_DATA) public mobile: boolean,
  ) { }

  ngOnInit(): void {
    this.getMembers();
    this.getDevices();
    this.form = this.fb.group({
      idm: this.idmControl,
      id: this.idControl,
      enable: this.enableControl,
      remark: this.remarkControl,
      banDevids: this.banDevidsControl
    });
  }

  ngAfterViewInit(): void {
    /* Prevent expanasion panel animation on init */
    setTimeout(() => this.disableAnimation = false);
}

  getMembers(): void {
    this.dbService.getAll<member>('members')
    .subscribe(members => this.members = members);
  }

  getDevices(): void {
    this.dbService.getAll<device>('devices')
    .subscribe(devices => {
      devices.forEach(device => {
        this.viewDevs.push({
          id: device.id,
          name: device.name,
          checked: false
        });
      });
    });
  }

  onCancel(): void {
    this.terminate = true;
    this.dialogRef.close();
  }

  onSubmit(): void {
    this.card.id = this.form.get('id')?.value;
    this.card.remark = this.form.get('remark')?.value;
    this.card.enable = this.form.get('enable')?.value;
    this.card.banDevids = this.viewDevs.filter(dev => dev.checked).map(el => el.id);
    this.dbService.exist('card', this.card.idm)
    .subscribe(result => {
      if(result){
        this.snackBar.open('このIDmは既に登録されています', '閉じる', {duration: 7000});
        this.idmControl.setValue('');
        this.scanStatus = 0;
      }
      else{
        this.dbService.add<card>('card', this.card)
        .subscribe(result => {
          if(result){
            this.snackBar.open('登録しました', '閉じる', {duration: 5000});
            this.dialogRef.close();
          }
          else{
            this.snackBar.open('登録できませんでした', '閉じる', {duration: 7000});
          }
        });
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
        if(this.terminate){
          break;
        }
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
