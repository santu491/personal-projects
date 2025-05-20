import { Component, OnInit } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { topNavBarModule } from 'src/app/core/defines';
import { ActivityService } from 'src/app/pages/activity/activity.service';
import { AuthService } from '../../core/services/index';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss']
})
export class NavbarComponent implements OnInit {
  public isLoggedIn!: boolean;
  public topNavBarModule = topNavBarModule;
  public navbarRouting = topNavBarModule.navbarRouting;
  public badgeCount: number = 0;
  envName = environment.value;

  constructor(
    private authService: AuthService,
    private _router: Router,
    private activityService: ActivityService
  ) {
    this.isLoggedIn = this.authService.isAdminLoggedIn();
    _router.events.subscribe((routeEvent) => {
      if (
        routeEvent instanceof NavigationEnd &&
        routeEvent.url.startsWith('/ui/pages')
      ) {
        this.activityService.getActivityCount(false).subscribe((res: any) => {
          this.badgeCount = res.data?.value?.count ?? 0;
        });
      }
    });
  }

  checkAccessPrivilege(accessData: any) {
    const currentRole = localStorage.getItem('role');
    if (accessData?.includes(currentRole)) {
      return true;
    } else return false;
  }

  ngOnInit() {
    this.authService.isLoggedIn().subscribe((loggedIn) => {
      this.isLoggedIn = loggedIn;
    });
    this.isLoggedIn = this.authService.isAdminLoggedIn();
  }

  profile() {
    this._router.navigate(['ui/pages/profile']);
  }

  settings() {
    this._router.navigate(['ui/pages/settings']);
  }

  activity() {
    this._router.navigate(['ui/pages/activity']);
  }

  logout() {
    this.authService.logOut();
    this.isLoggedIn = this.authService.isAdminLoggedIn();
  }
}
