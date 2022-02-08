import { Component, OnInit } from '@angular/core';
import { NFCPortLib, NFCPortError, Configuration, DetectionOption, CommunicationOption, TargetCard } from 'nfc-module';

 
@Component({
  selector: 'app-nfc',
  templateUrl: './nfc.component.html',
  styleUrls: ['./nfc.component.scss']
})
export class NfcComponent implements OnInit {

  constructor() { 
  }

  ngOnInit(): void {
  }
  
	detectTitle: any = document.getElementById('detect-title');
	detectMessage: any = document.getElementById('detect');
	communicateTitle: any = document.getElementById('communicate-title');
	communicateMessage: any = document.getElementById('communicate');

  /*
	document.getElementById('FeliCa').addEventListener('click', function () {
		felica_card();
		return;
	});

	document.getElementById('MIFARE').addEventListener('click', function () {
		mifare_card();
		return;
	});
  */

	async felica_card() {
		console.log('[Reading a FeliCa Card] Begin');

		let lib : any;

    /* 
		this.detectTitle.innerText = '';
		this.detectMessage.innerText = '';
		this.communicateTitle.innerText = '';
		this.communicateMessage.innerText = '';
    */
   
		try {
			/* create NFCPortLib object */
			lib = new NFCPortLib();

			/* init() */
			let config = new Configuration(500 /* ackTimeout */, 500 /* receiveTimeout */, true /* autoBaudRate*/, true /* autoDeviceSelect */);
			await lib.init(config);

			/* open() */
			await lib.open();
			console.log('deviceName : ' + lib.deviceName);

			/* detectCard(FeliCa Card) */
			let detectOption = new DetectionOption(new Uint8Array([0xff, 0xff]), 0, true, false, null);
			let card = await lib.detectCard('iso18092', detectOption)
      .then((ret: { systemCode: null; idm: any; pmm: any; }) => {
				this.detectTitle.innerText = 'Card is detected';
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
				this.detectMessage.innerText = 'IDm : ' + this._array_tohexs(ret.idm);
				return ret;
			}, (error: any) => {
				this.detectTitle.innerText = 'Card is not detected';
				throw(error);
			});

			/* communicateThru(Read Block) */
			let felica_read_without_encryption = new Uint8Array([16, 0x06, 0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00, 1, 0x09,0x10, 1, 0x80,0x01]);
			this._array_copy(felica_read_without_encryption, 2, card.idm, 0, card.idm.length);
			let response = await lib.communicateThru(felica_read_without_encryption, 100, detectOption)
			.then((ret: any) => {
				this.communicateTitle.innerText = 'Reading...';
				this.communicateMessage.innerText = 'Send    : ' + this._array_tohexs(felica_read_without_encryption) +
											   '\nReceive : ' + this._array_tohexs(ret);
				return ret;
			}, (error: any) => {
				this.communicateTitle.innerText = 'Read error';
				throw(error);
			});

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
