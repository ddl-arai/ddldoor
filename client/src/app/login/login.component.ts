import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';
import { user } from '../models/user';
import { Router } from '@angular/router';
import { AuthService } from '../auth.service';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
  user: user = {
    email: '',
    password: ''
  }

  form!: FormGroup;
  emailControl = new FormControl(null, [
    Validators.required,
    Validators.email
  ]);
  passwordControl = new FormControl(null, Validators.required);

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private authService: AuthService,
    private snackBar: MatSnackBar
  ) { }

  ngOnInit(): void {
    this.form = this.fb.group({
      email: this.emailControl,
      password: this.passwordControl
    });
  }

  onSubmit() {
    this.user.email = this.form.get('email')?.value; 
    this.user.password = this.form.get('password')?.value;
    this.authService.login(this.user)
    .subscribe(result => {
      if(result){
        this.router.navigate(['/home']);
      }
      else{
        this.loginFailed();
      }
    });
  }

  loginFailed(): void {
    this.snackBar.open('ログインできませんでした', '閉じる', { duration: 5000 });
    //this.form.reset();
  }


}
