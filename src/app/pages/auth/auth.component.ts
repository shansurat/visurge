import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { BehaviorSubject } from 'rxjs';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-auth',
  templateUrl: './auth.component.html',
  styleUrls: ['./auth.component.scss'],
})
export class AuthComponent implements OnInit {
  isDeviceRecognized = new BehaviorSubject(true);

  signInFormGroup!: FormGroup;

  constructor(
    public authServ: AuthService,
    private fb: FormBuilder,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.signInFormGroup = this.fb.group({
      username: '',
      password: '',
    });
  }

  signIn() {
    this.authServ.signIn(this.signInFormGroup.value).subscribe((res) => {
      console.log('Signed In');
      this.router.navigate(['dashboard']);
    });
  }

  signOut() {
    this.authServ.signOut();
  }
}
