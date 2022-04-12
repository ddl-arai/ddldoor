import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { user } from '../models/user';
import { AuthService } from '../auth.service';

@Component({
  selector: 'app-reset',
  templateUrl: './reset.component.html',
  styleUrls: ['./reset.component.scss']
})
export class ResetComponent implements OnInit {
  display : boolean = false;
  token: string = ''
  user: user = {
    email: '',
    password: '',
    admin: false
  }
  form!: FormGroup;
  emailControl = new FormControl(null);
  passwordControl = new FormControl(null, Validators.required);
  password2Control = new FormControl(null, Validators.required);

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private route: ActivatedRoute,
    private snackBar: MatSnackBar,
    private authService: AuthService
  ) { }

  ngOnInit(): void {
    this.token = String(this.route.snapshot.paramMap.get('token'));
    this.checkToken();
    this.form = this.fb.group({
      email: this.emailControl,
      password: this.passwordControl,
      password2: this.password2Control
    });
  }

  checkToken(): void {
    this.authService.tokenCheck(this.token)
    .subscribe(result => {
      if(result['code'] === 0){
        this.display = true;
        this.user.email = result['email'];
        this.emailControl.setValue(this.user.email);
      }
      else{
        this.snackBar.open('リンクが不正です', '閉じる', { duration: 7000 });
        this.router.navigate(['login']);
      }
    });
  }

  onSubmit() {
    this.user.password = this.form.get('password')?.value;
    if(this.user.password !== this.form.get('password2')?.value){
      this.snackBar.open('パスワードが一致していません', '閉じる', { duration: 5000 });
      //this.form.get('password')?.setValue(null);
      this.form.get('password2')?.setValue(null);
      return;
    }
    else{
      this.authService.changePW(this.user, this.token)
      .subscribe(result => {
        if(result){
          this.snackBar.open('パスワードを変更しました', '閉じる', { duration: 5000 });
          this.router.navigate(['/home']);
        }
        else{
          this.snackBar.open('パスワードを変更できませんでした', '閉じる', { duration: 7000 });
        }
      });
    }
    
  }

}
