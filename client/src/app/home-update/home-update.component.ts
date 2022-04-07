import { Component, OnInit } from '@angular/core';
import { SwUpdate } from '@angular/service-worker';

@Component({
  selector: 'app-home-update',
  templateUrl: './home-update.component.html',
  styleUrls: ['./home-update.component.scss']
})
export class HomeUpdateComponent implements OnInit {

  constructor(
    private swUpdate: SwUpdate,
  ) { }

  ngOnInit(): void {
  }

  onUpdate(): void {
    this.swUpdate.activateUpdate().then(() => document.location.reload());
  }

}
