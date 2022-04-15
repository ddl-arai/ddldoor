import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { user } from '../models/user';
import { DbService } from '../db.service';

@Component({
  selector: 'app-reset-init',
  templateUrl: './reset-init.component.html',
  styleUrls: ['./reset-init.component.scss']
})
export class ResetInitComponent implements OnInit {
  user: user = {
    email: '',
    password: '',
    admin: false
  }
  form!: FormGroup;
  emailControl = new FormControl(null);
  passwordControl = new FormControl(null, Validators.required);
  password2Control = new FormControl(null, Validators.required);
  redirectTo: string | null = null;

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private route: ActivatedRoute,
    private snackBar: MatSnackBar,
    private dbService: DbService
  ) { }

  ngOnInit(): void {
    this.getUser();
    this.redirectTo = this.route.snapshot.queryParamMap.get('redirectTo');
    this.form = this.fb.group({
      email: this.emailControl,
      password: this.passwordControl,
      password2: this.password2Control
    });
  }

  getUser(): void {
    this.dbService.getUser()
    .subscribe(user => {
      this.user = user;
      this.emailControl.setValue(this.user.email);
    });
  }

  onSubmit() {
    this.user.password = this.form.get('password')?.value;
    if(this.user.password !== this.form.get('password2')?.value){
      this.snackBar.open('パスワードが一致していません', '閉じる', { duration: 5000 });
      this.form.get('password2')?.setValue(null);
      return;
    }
    else{
      this.dbService.update<user>('user', this.user)
      .subscribe(result => {
        if(result){
          this.snackBar.open('パスワードを変更しました', '閉じる', { duration: 5000 });
          if(this.redirectTo){
            this.router.navigate([this.redirectTo]);
          }
          else{
            this.router.navigate(['/home']);
          }
        }
        else{
          this.snackBar.open('パスワードを変更できませんでした', '閉じる', { duration: 7000 });
        }
      });
    }
    
  }

}
