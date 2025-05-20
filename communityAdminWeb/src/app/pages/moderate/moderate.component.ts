import { Component, OnInit } from "@angular/core";
import { roleAccess, roles } from "src/app/core/constants";
import { moderateModule } from "src/app/core/defines";
import { rolePermissionsValidation } from "src/app/core/utils";
@Component({
  selector: "app-moderate",
  templateUrl: "./moderate.component.html",
  styleUrls: ["./moderate.component.scss"],
})
export class ModerateComponent implements OnInit {
  public moderateModule = moderateModule;
  public rolePermission = localStorage.getItem("rolePermissions");
  public view = rolePermissionsValidation(this.rolePermission, 'Users', roleAccess[0], );

  ngOnInit(): void {
    /* empty 'ngOnInit' method */
  }
}
