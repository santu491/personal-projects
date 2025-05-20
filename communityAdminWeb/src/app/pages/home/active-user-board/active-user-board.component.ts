import { Component, OnInit } from '@angular/core';
import { ActiveUser } from 'src/app/core/models';
import { DashboardService } from '../dashboard.service';

@Component({
  selector: 'active-user-board',
  templateUrl: './active-user-board.component.html',
  styleUrls: ['./active-user-board.component.scss']
})
export class ActiveUserBoardComponent implements OnInit {
  isDataLoaded = false;
  countData!: ActiveUser;

  constructor(private dashboardSvc: DashboardService) {}

  ngOnInit(): void {
    this.dashboardSvc.getActiveUsers().subscribe((response: any) => {
      if (response?.data?.isSuccess) {
        this.isDataLoaded = true;
        this.countData = response.data.value;
      } else {
        this.isDataLoaded = false;
        this.countData = this.countData ?? {
          totalUsers: 0,
          todayLogin: 0,
          monthLogin: 0
        };
      }
    });
  }
}
