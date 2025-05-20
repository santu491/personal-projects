import { Component, OnInit } from '@angular/core';
import { ChartConfiguration } from 'chart.js';
import { DashboardService } from '../dashboard.service';

@Component({
  selector: 'community-activity-chart',
  templateUrl: './community-activity-chart.component.html',
  styleUrls: ['./community-activity-chart.component.scss']
})
export class CommunityActivityChartComponent implements OnInit {
  isDataLoaded = false;

  constructor(private dashboardSvc: DashboardService) {}

  ngOnInit(): void {
    this.dashboardSvc.getPostActivities().subscribe((response: any) => {
      if (response?.data?.isSuccess) {
        this.isDataLoaded = true;
        const labels = [];
        const postActivity = [];
        const communityData = response.data.value;
        for (const community of communityData) {
          labels.push(community.communityName);
          postActivity.push(community.activityCount);
        }
        this.chartData = {
          labels: labels,
          datasets: [
            {
              data: postActivity,
              label: 'Post Activites',
              backgroundColor: '#8A6FDF'
            }
          ]
        };
      }
    });
  }

  public chartOptions: ChartConfiguration['options'] = {
    responsive: true,
    scales: {
      y: {
        beginAtZero: true
      }
    }
  };

  public chartData: ChartConfiguration['data'] = {
    labels: [],
    datasets: [{ data: [], label: 'New Users' }]
  };
}
