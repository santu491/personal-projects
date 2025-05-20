import { Component, OnInit } from "@angular/core";
import { systemModule } from "src/app/core/defines";
@Component({
  selector: "app-system",
  templateUrl: "./system.component.html",
  styleUrls: ["./system.component.scss"],
})
export class SystemComponent implements OnInit {
  public systemModule = systemModule;
  public role = localStorage.getItem("role");

  ngOnInit(): void {
    /* empty 'ngOnInit' method */
  }
}
