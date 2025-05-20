import { Component, OnInit } from "@angular/core";
import { AuthService } from "src/app/core/services";
import { getCurrentFY } from "src/app/core/utils";

@Component({
  selector: "app-footer",
  templateUrl: "./footer.component.html",
  styleUrls: ["./footer.component.scss"],
})
export class FooterComponent implements OnInit {
  public isLoggedIn!: boolean;
  public financialYearInfo: string = getCurrentFY();
  constructor(private authService: AuthService) {
    this.isLoggedIn = this.authService.isAdminLoggedIn();
  }

  ngOnInit() {
    this.authService.isLoggedIn().subscribe((loggedIn) => {
      this.isLoggedIn = loggedIn;
    });
    this.isLoggedIn = this.authService.isAdminLoggedIn();
  }
}
