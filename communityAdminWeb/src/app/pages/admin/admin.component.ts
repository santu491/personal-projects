import { Component, OnInit } from '@angular/core';
import { collections, roleAccess } from 'src/app/core/constants';
import { adminModule } from 'src/app/core/defines';
import { rolePermissionsValidation } from 'src/app/core/utils';

@Component({
  selector: 'app-admin',
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.scss']
})
export class AdminComponent implements OnInit {
  public adminSideNav = adminModule;
  public rolePermission = localStorage.getItem("rolePermissions");
  public view = rolePermissionsValidation(this.rolePermission, collections.USERS, roleAccess[0], );
  
  ngOnInit(): void {
    /* empty 'ngOnInit' method */
  }

}
