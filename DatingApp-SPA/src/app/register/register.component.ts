import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { BsDatepickerConfig } from 'ngx-bootstrap/datepicker';
import { User } from '../_models/user';
import { AlertifyService } from '../_services/alertify.service';
import { AuthService } from '../_services/auth.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})
export class RegisterComponent implements OnInit {
  @Output() cancelRegister = new EventEmitter();
  user: User;
  registerForm: FormGroup;
  bsConfig : Partial<BsDatepickerConfig>; // Very Important and new Concept for me!!!!!!!
  constructor(private authService: AuthService, private alertify: AlertifyService, private fb: FormBuilder, private router: Router) { }

  ngOnInit() {
    this.bsConfig = {
      containerClass : 'theme-red'
    }
    this.createRegisterForm();



    // this.registerForm = new FormGroup({
    //   username: new FormControl('', Validators.required),
    //   password: new FormControl('', [Validators.required,Validators.minLength(4),Validators.maxLength(8)]),
    //   confirmPassword: new FormControl('', [Validators.required])
    // }, this.passwordMatchValidator);
  }

  // Custom validator
  passwordMatchValidator(g: FormGroup){
    return g.get('password').value === g.get('confirmPassword').value ? null : {'mismatch': true};
  }


  createRegisterForm() {
    this.registerForm = this.fb.group({
      gender: ['male'],
      username: ['', Validators.required],
      knownAs: ['', Validators.required],
      dateOfBirth: [null, Validators.required],
      city: ['', Validators.required],
      country: ['', Validators.required],
      password: ['', [Validators.required, Validators.minLength(4), Validators.maxLength(8)]],
      confirmPassword: ['', Validators.required]
    }, {validators: this.passwordMatchValidator});
  }



  register(){
    this.user = Object.assign({},this.registerForm.value);   // Great method provided by JS
    this.authService.register(this.user).subscribe(()=>{
      this.alertify.success('Registration Successful');
    },error => {
      this.alertify.error(error);
    }, () => {
      this.authService.login(this.user).subscribe(() => {
        this.router.navigate(['/members']);
      });
    });
  }

  cancel(){
    this.cancelRegister.emit(false);
  }

}
