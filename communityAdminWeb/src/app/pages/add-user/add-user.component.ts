import { Component, OnInit, ViewChild } from "@angular/core";
import { UntypedFormBuilder, UntypedFormControl, UntypedFormGroup } from "@angular/forms";
import { MatOption } from "@angular/material/core";
import { ToastrService } from "ngx-toastr";
import { generic, roles, statusCodes } from "src/app/core/constants";
import { addUserModule, profile } from "src/app/core/defines";
import { AddUserPayload, Community, UpdateProfilePayload } from "src/app/core/models";
import { DraftContentService } from "../draft-content/draft-content.service";
import { ProfileService } from "../profile/profile.service";
import { ViewAllUsersService } from "../view-all-users/view-all-users.service";
@Component({
  selector: "app-add-user",
  templateUrl: "./add-user.component.html",
  styleUrls: ["./add-user.component.scss"],
})
export class AddUserComponent implements OnInit {
  @ViewChild("allSelected") private allSelected!: MatOption;
  constructor(
    private _formBuilder: UntypedFormBuilder,
    private _toastrService: ToastrService,
    private _draftContentService: DraftContentService,
    private _profileService: ProfileService,
    private _viewAllUsersService: ViewAllUsersService,
  ) { }

  public role = localStorage.getItem("role");
  public addUserForm!: UntypedFormGroup;
  public profile = profile;
  public addUserModule = addUserModule;
  public roleList: any = roles;
  public selectiveRole = this.roleList;
  public communityList: Array<Community> = [];
  public allCommunitiesId: any = [];
  public selectedCommunityName: string = "";
  private selectedCommunitiesId: Array<any> = [];
  public personaUser: boolean = false;

  get communities(): UntypedFormControl {
    return this.addUserForm.get("communities") as UntypedFormControl;
  }

  callGetAllCommunities() {
    this._draftContentService.getAllCommunities().subscribe((data: any) => {
      this.communityList = data?.data?.value ?? [];
      if (data?.data?.value) {
        this.communityList.forEach((item: any) => {
          this.allCommunitiesId.push(item.id);
        });
      }
    });
  }

  onRoleChange = (role: any) => {
    this.addUserForm.controls["selectedRole"].setValue(role);
  };

  toggleAllSelection() {
    if (this.allSelected?.selected) {
      this.addUserForm.controls.communities.patchValue([
        ...this.allCommunitiesId,
        0,
      ]);
      this.selectedCommunityName = profile.allCommunitiesLabel;
      let tempArray: Array<any> = this.addUserForm.controls.communities?.value;
      this.selectedCommunitiesId = tempArray.filter((item: any) => item !== 0);
    } else {
      this.addUserForm.controls.communities.patchValue([]);
    }
  }
  singleSelectAssignedCommunity() {
    if (this.allSelected?.selected) {
      this.allSelected?.deselect();
    }
    if (
      this.addUserForm.controls.communities.value?.length ==
      this.communityList?.length
    ) {
      this.allSelected?.select();
    }
    if (this.addUserForm.controls.communities?.value) {
      let checkValue = this.addUserForm.controls.communities?.value[0];
      const selectedCommunity = this.communityList?.filter(
        (item: any) => item.id == checkValue
      );
      this.selectedCommunityName =
        selectedCommunity[0]?.title || profile.allCommunitiesLabel;
      const tempArray: Array<any> =
        this.addUserForm.controls.communities?.value;
      this.selectedCommunitiesId = tempArray.filter((item: any) => item !== 0);
    }
  }

  onBlurForm(
    event: any,
    type: "anthemUSDomainID" | "selectedRole" | "communities"
  ) {
    this.addUserForm.controls[type].setValue(event.target.value.trim());
    this.onFormChange();
  }

  onFormChange() {
    if (this.personaUser) {
      if (this.addUserForm.controls["firstName"]?.value?.length === 0 ||
        this.addUserForm.controls["lastName"]?.value?.length === 0 ||
        this.addUserForm.controls["communities"]?.value?.length === 0) {
        return true;
      }
      return false;
    } else {
      const isSCAdmin =
        this.addUserForm.controls["selectedRole"]?.value === roles[0].role || this.addUserForm.controls["selectedRole"]?.value === roles[2].role;
      const isSCAdvocate =
        this.addUserForm.controls["selectedRole"]?.value === roles[1].role;
      if (
        isSCAdmin &&
        this.addUserForm.controls["anthemUSDomainID"]?.value?.length > 0 &&
        this.addUserForm.controls["selectedRole"]?.value?.length > 0
      ) {
        return false;
      } else if (
        isSCAdvocate &&
        this.addUserForm.controls["anthemUSDomainID"]?.value?.length > 0 &&
        this.addUserForm.controls["selectedRole"]?.value?.length > 0 &&
        this.addUserForm.controls["communities"]?.value?.length > 0
      ) {
        return false;
      } else return true;
    }
  }

  onTextChange = (_event: any, _inputType: "anthemUSDomainID" | "firstName" | "lastName") => {
    this.onFormChange();
  };

  clearAddUserForm() {
    this.personaUser = false;
    this.addUserForm.reset();
    this.addUserForm.setErrors(null);
  }

  onClickAddUser() {
    const selectedRole = this.addUserForm.controls["selectedRole"].value;
    let addUserPayload: AddUserPayload;
    if (selectedRole === roles[0].role || selectedRole === roles[2].role) {
      addUserPayload = {
        username: this.addUserForm.controls["anthemUSDomainID"]?.value,
        role: this.addUserForm.controls["selectedRole"]?.value,
      };
    } else {
      addUserPayload = {
        username: this.addUserForm.controls["anthemUSDomainID"]?.value,
        role: this.addUserForm.controls["selectedRole"]?.value,
        communities: this.selectedCommunitiesId,
      };
      if (this.addUserForm.controls["isPersona"].value) {
        addUserPayload.firstName = this.addUserForm.controls["firstName"].value;
        addUserPayload.lastName = this.addUserForm.controls["lastName"].value;
        addUserPayload.displayName = this.addUserForm.controls["displayName"].value;
        addUserPayload.aboutMe = this.addUserForm.controls["aboutMe"].value;
        addUserPayload.interests = this.addUserForm.controls["interests"].value;
        addUserPayload.location = this.addUserForm.controls["location"].value;
        addUserPayload.isPersona = this.addUserForm.controls["isPersona"].value;
      }
    }
    this.callAddUser(addUserPayload);
  }

  callAddUser(addUserPayload: AddUserPayload) {
    this._profileService.addUser(addUserPayload).subscribe(
      (data: any) => {
        data?.data?.isSuccess
          ? this._toastrService.success(addUserModule.userAddedSuccess)
          : this._toastrService.error(generic.errorMessage);
        this.clearAddUserForm();
      },
      (error: any) => {
        if (error?.error?.data?.errors?.errorInfo?.errorCode === statusCodes[477]) {
          let user = error?.error?.data?.errors?.errorInfo?.detail;
          if (
            confirm(
              addUserModule.confirmAddingInactiveUser
            )
          ) {
            const updateProfile: UpdateProfilePayload = {
              id: user.id,
              active: true,
              isPersona: addUserPayload.isPersona,
              role: addUserPayload.role,
              communities: addUserPayload.communities,
              firstName: user.firstName,
              lastName: user.lastName,
              displayName: user.displayName,
              displayTitle: roles.filter((role) => addUserPayload.role == role.role)[0].name,
              aboutMe: user.aboutMe,
              interests: user.interests,
              location: user.location,
              removed: false
            }
            this._profileService
              .updateAdminProfile(updateProfile)
              .subscribe((data: any) => {
                if (data?.data?.isSuccess) {
                  this._toastrService.success(addUserModule.userAddedSuccess);
                }
              });
          }
        } else {
          let errMessage =
            error?.error?.data?.errors?.detail ||
            error?.error?.data?.errors?.errorInfo?.detail;
          this._toastrService.error(errMessage || generic.errorMessage);
        }
      }
    );
  }

  togglePersona(event: any) {
   this.personaUser =  event.checked;
   if(event.checked) {
    this.selectiveRole = [roles[1]];
   }
  }

  domainIdMandate(persona: any) {
    return (persona === "") ? true : false;
  }

  ngOnInit(): void {
    this.callGetAllCommunities();
    this.personaUser = false;
    this.addUserForm = this._formBuilder.group({
      anthemUSDomainID: [""],
      selectedRole: [""],
      communities: [""],
      isPersona: [""],
      firstName: [""],
      lastName: [""],
      aboutMe: [""],
      interests: [""],
      location: [""],
      displayName: [""],
    });
  }
}
