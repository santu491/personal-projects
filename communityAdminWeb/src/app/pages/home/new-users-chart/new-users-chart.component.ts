import { Component, OnInit } from '@angular/core';
import { ChartConfiguration } from 'chart.js';
import { DashboardService } from '../dashboard.service';

@Component({
  selector: 'new-users-chart',
  templateUrl: './new-users-chart.component.html',
  styleUrls: ['./new-users-chart.component.scss']
})
export class NewUsersChartComponent implements OnInit {
  isDataLoaded = false;
  constructor(private dashboardSvc: DashboardService) {}

  ngOnInit(): void {
    this.dashboardSvc.getNewUsersCount().subscribe((response: any) => {
      const dataSet = response?.data?.value?.userCount.reverse();
      const labels = response?.data?.value?.month.reverse();
      this.isDataLoaded = true;
      this.createChart(labels, dataSet);
    });
  }

  createChart(labels: [], dataSets: []) {
    this.lineChartData = {
      labels: labels,
      datasets: [{ data: dataSets, label: 'New Users', borderColor: '#9BD0F5' }]
    };
  }

  public lineChartOptions: ChartConfiguration<'line'>['options'] = {
    responsive: true,
    scales: {
      y: {
        beginAtZero: true
      }
    }
  };

  public lineChartData: ChartConfiguration<'line'>['data'] = {
    labels: [],
    datasets: [{ data: [], label: 'New Users' }]
  };
}
