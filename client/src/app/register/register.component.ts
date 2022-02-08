import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';
import { DbService } from '../db.service';
import { user } from '../models/user';
import { Router } from '@angular/router';
import { AuthService } from '../auth.service';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})
export class RegisterComponent implements OnInit {
  user: user = {
    email: '',
    password: ''
  };

  form!: FormGroup;
  emailControl = new FormControl(null, [
    Validators.required,
    Validators.email
  ]);
  passwordControl = new FormControl(null, Validators.required);
  password2Control = new FormControl(null, Validators.required);

  constructor(
    private dbService: DbService,
    private fb: FormBuilder,
    private router: Router,
    private authService: AuthService,
    private snackBar: MatSnackBar
  ) { }

  ngOnInit(): void {
    this.form = this.fb.group({
      email: this.emailControl,
      password: this.passwordControl,
      password2: this.password2Control
    });
  }

  onSubmit() {
    this.user.email = this.form.get('email')?.value; 
    this.user.password = this.form.get('password')?.value;
    if(this.user.password !== this.form.get('password2')?.value){
      this.snackBar.open('パスワードが一致していません', '閉じる', { duration: 5000 });
      //this.form.get('password')?.setValue(null);
      this.form.get('password2')?.setValue(null);
      return;
    }
    else{
      this.dbService.userExist(this.user.email)
      .subscribe(exist => {
        if(exist){
          this.snackBar.open('同アドレスは既に登録済みです', '閉じる', { duration: 5000 });
          //this.router.navigate(['login']);
        }
        else{
          this.dbService.createUser(this.user)
          .subscribe(() => {
            this.authService.login(this.user)
            .subscribe(result => {
              if(result){
                this.router.navigate(['home']);
              }
              else{
                //
              }
            });
          });
        }
      });
    }
  }

}
