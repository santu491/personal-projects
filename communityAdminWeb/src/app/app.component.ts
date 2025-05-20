import { Component, OnInit } from "@angular/core";
import { AuthService } from "./core/services";

@Component({
  selector: "app-root",
  templateUrl: "./app.component.html",
  styleUrls: ["./app.component.scss"],
})
export class AppComponent implements OnInit {
  public isLoggedIn: any;
  constructor(private authService: AuthService) {}

  ngOnInit() {
    this.authService.isLoggedIn().subscribe((loggedIn) => {
      this.isLoggedIn = loggedIn;
    });
    this.isLoggedIn = this.authService.isAdminLoggedIn();
  }
}
