import { Component, OnInit } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { ToastrService } from 'ngx-toastr';
import { planExpiredUserModule } from 'src/app/core/defines';
import { PlanExpiredUsersService } from './plan-expired-users.service';

@Component({
  selector: 'app-planned-expired-users',
  templateUrl: './plan-expired-users.component.html',
  styleUrls: ['./plan-expired-users.component.scss']
})
export class PlanExpiredUsersComponent implements OnInit {
  labels = planExpiredUserModule;
  expiredUsers!: MatTableDataSource<any>;
  tableColumn = this.labels.columnsData;
  constructor(
    private _planExpiredUserService: PlanExpiredUsersService,
    private _toasterService: ToastrService
  ) {}

  ngOnInit(): void {
    this.getExpiredUsers();
  }

  getExpiredUsers() {
    this._planExpiredUserService.getPlanExpiredUsers().subscribe(
      (data: any) => {
        this.expiredUsers = new MatTableDataSource(data?.data?.value ?? []);
      },
      (error: any) => {
        console.log('errors...', error);
      }
    );
  }

  deleteUser(user: any) {
    if (confirm(this.labels.deleteUserConfirmAlert)) {
      this.updateUser(user, true);
    }
  }

  addUser(user: any) {
    if (confirm(this.labels.addUserConfirmAlert)) {
      this.updateUser(user, false);
    }
  }

  updateUser(user: any, isDeleted: boolean) {
    const payLoad = {
      approved: isDeleted,
      userId: user.id
    };
    this._planExpiredUserService.updatedUser(payLoad).subscribe(
      (response) => {
        this.getExpiredUsers();
        this._toasterService.success(
          isDeleted
            ? this.labels.deleteUserConfirmSuccess
            : this.labels.enableUserConfirmSuccess
        );
      },
      (error) => {
        console.log('error...', error);
      }
    );
  }
}
