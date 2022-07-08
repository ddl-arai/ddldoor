import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {

  constructor(
    private router: Router
  ) { }

  ngOnInit(): void {
    /* Initial display */
    let initial = '/home/dashboard';
    if(this.router.routerState.snapshot.url !== '/home'){
      this.router.navigate([this.router.routerState.snapshot.url]);
    }
    else{
      this.router.navigate([initial]);
    }
  }

}
