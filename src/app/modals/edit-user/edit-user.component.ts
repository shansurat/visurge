import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MdbModalRef } from 'mdb-angular-ui-kit/modal';
import { User } from 'src/app/interfaces/user';

@Component({
  selector: 'app-edit-user',
  templateUrl: './edit-user.component.html',
  styleUrls: ['./edit-user.component.scss'],
})
export class EditUserComponent implements OnInit {
  user!: User;

  editUserFormGroup!: FormGroup;

  constructor(
    private fb: FormBuilder,
    public modalRef: MdbModalRef<EditUserComponent>
  ) {}

  ngOnInit(): void {
    let user = this.user;
    console.log(this.user);
    this.editUserFormGroup = this.fb.group({
      username: [user.username],
      password: '',
      admin: [''],
    });
  }

  editUser() {}
}
