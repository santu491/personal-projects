import { Component, OnInit, ViewChild } from "@angular/core";
import { SidenavComponent } from "src/app/components/sidenav/sidenav.component";
import { engageModule } from "src/app/core/defines";
@Component({
  selector: "app-engage",
  templateUrl: "./engage.component.html",
  styleUrls: ["./engage.component.scss"],
})
export class EngageComponent implements OnInit {
  public engageModule = engageModule;
  @ViewChild(SidenavComponent) sideNav!: SidenavComponent;

  ngOnInit(): void {
    /* empty 'ngOnInit' method */
  }
}
