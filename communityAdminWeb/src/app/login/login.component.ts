import { Component, OnInit } from "@angular/core";
import { UntypedFormBuilder, UntypedFormGroup, Validators } from "@angular/forms";
import { ActivatedRoute, Router } from "@angular/router";
import { ToastrService } from "ngx-toastr";
import pkg from "../../../package.json";
import { generic } from "../core/constants";
import { loginModule } from "../core/defines";
import { AdminCredentials } from "../core/models/user";
import { AuthService } from "../core/services";
import { getCurrentFY } from "../core/utils";
@Component({ templateUrl: "login.component.html" })
export class LoginComponent implements OnInit {
  public financialYearInfo: string = getCurrentFY();
  public loginModule: any = loginModule;
  public loginForm!: UntypedFormGroup;
  public loading = false;
  public submitted = false;
  public returnUrl!: string;
  public apiVersion: string = "-";
  public appVersion: string = pkg.version;
  public hide: boolean = true;

  constructor(
    private formBuilder: UntypedFormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private authService: AuthService,
    private _toastrService: ToastrService
  ) {}

  ngOnInit() {
    // Get API Version
    this.authService.apiVersion().subscribe(
      (data: any) => {
        this.apiVersion = data;
      },
      (_error: any) => {
        this._toastrService.error(generic.somethingWentWrong);
      }
    );

    localStorage.clear();
    this.loginForm = this.formBuilder.group({
      username: ["", Validators.required],
      password: ["", Validators.required],
    });

    /* get return url from route parameters or default to '/' */
    this.returnUrl = this.route.snapshot.queryParams["returnUrl"] || "/";
  }

  /* convenience getter for easy access to form fields */
  get f() {
    return this.loginForm.controls;
  }

  onBlurMethod(event: any, type: "username") {
    this.loginForm.controls[type].setValue(event.target.value.trim());
  }

  onSubmit() {
    this.submitted = true;
    /* stop here if form is invalid */
    if (this.loginForm.invalid) {
      return;
    }

    let payload: AdminCredentials;

    payload = {
      username: this.f.username.value,
      password: this.f.password.value,
    };
    this.authService.adminLogin(payload).subscribe(
      (data: any) => {
        if (data?.data?.isSuccess) {
          // Setting Admin Data
          this.authService.setAdminData(data?.data?.value);
          // Redirecting to stored URL
          if (this.authService.redirectUrl) {
            this.router.navigate([this.authService.redirectUrl]);
            this.authService.redirectUrl = null;
          } else {
            // Navigate to Dashboard
            this.router.navigate(["/ui/pages"]);
          }
        } else {
          this._toastrService.error(generic.errorMessage);
        }
      },
      (error: any) => {
        if (error?.error?.data?.errors?.detail) {
          this._toastrService.error(error?.error?.data?.errors?.detail);
        } else {
          this._toastrService.error(generic.errorMessage);
        }
      }
    );
  }
}
