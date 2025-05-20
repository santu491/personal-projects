import { Component, OnInit } from '@angular/core';
import { EnvType, commentContentType } from 'src/app/core/constants';
import { Filter } from 'src/app/core/models/metrics';
import { environment } from 'src/environments/environment';
import { MetricsHelperService } from '../../metrics/metrics-helper.service';
import { DashboardService } from '../dashboard.service';
import { ChartConfiguration } from 'chart.js';

@Component({
  selector: 'user-type-chart',
  templateUrl: './user-type-chart.component.html',
  styleUrls: ['./user-type-chart.component.scss']
})
export class UserTypeChartComponent implements OnInit {
  isDataLoaded = false;

  constructor(
    private dashboardSvc: DashboardService,
    private metricsSvc: MetricsHelperService
  ) {}

  ngOnInit(): void {
    this.metricsSvc.getMemberTypes(<EnvType>environment.value, () => {
      const commercialTitle = this.metricsSvc.commercialBrand;
      const medicaidBrand = this.metricsSvc.marketBrandOptions;
      this.getUserData(commercialTitle, medicaidBrand);
    });
  }

  getUserData(commercial: Filter[], medicaid: Filter[]) {
    this.dashboardSvc.getUserCount().subscribe((response: any) => {
      const userValue = response.data.value;
      const medicaidTotal = Object.keys(userValue.medicaidUsers).reduce(
        (sum,key) => sum + userValue.medicaidUsers[key], 
        0
      );
      const memberLabel = [ 'Commercial', 'Medicaid' ];
      const memberValue = [ userValue.commercialUsers, medicaidTotal ];
      this.pieChartData = {
        labels: memberLabel,
        datasets: [{ data: memberValue }]
      };
      
      const labels: string[] = [];
      const values: number[] = [];
      Object.keys(userValue.medicaidUsers).forEach((market: any) => {
        const marketInfo = medicaid.find((marketTitle) => marketTitle.value === market);
        if(marketInfo) {
          labels.push(marketInfo.title);
        }
        else {
          labels.push(market);
        }
        values.push(userValue.medicaidUsers[market]);
      });
      this.medicaidChartData = {
        labels: labels,
        datasets: [{ data: values }]
      };

      this.isDataLoaded = true;
    });
  }

  public pieChartOptions: ChartConfiguration<'pie'>['options'] = {
    responsive: true,
    plugins: {
      legend: {
        display: true,
        position: 'top',
      }
    }
  };

  public pieChartData: ChartConfiguration<'pie'>['data'] = {
    labels: [],
    datasets: [{ data: []}]
  };

  public medicaidChartOptions: ChartConfiguration<'pie'>['options'] = {
    responsive: true,
    plugins: {
      legend: {
        display: false,
        position: 'top',
      }
    }
  };

  public medicaidChartData: ChartConfiguration<'pie'>['data'] = {
    labels: [],
    datasets: [{ data: []}]
  };
}
