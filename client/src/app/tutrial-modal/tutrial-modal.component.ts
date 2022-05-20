import { Component, OnInit } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-tutrial-modal',
  templateUrl: './tutrial-modal.component.html',
  styleUrls: ['./tutrial-modal.component.scss']
})
export class TutrialModalComponent implements OnInit {

  constructor(
    public dialogRef: MatDialogRef<TutrialModalComponent>,
  ) { }

  ngOnInit(): void {
  }

}
