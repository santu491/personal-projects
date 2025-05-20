import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { publicApi } from 'src/app/core/apiUtils';
import { EnvType } from 'src/app/core/constants';
import { DateRange } from 'src/app/core/models/common';
import { DownloadPrintService } from 'src/app/core/services/download-print.service';
import { baseURL, env, environment } from 'src/environments/environment';
import { MetricsService } from './metrics.service';

@Component({
  selector: 'app-metrics',
  templateUrl: './metrics.component.html',
  styleUrls: ['./metrics.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class MetricsComponent implements OnInit {
  public showButtons: boolean = false;
  public envName: string = '';
  showError = false;
  selectedEnv!: EnvType;
  memberFilter!: string | undefined;
  metricsData: any;
  filterApplied: boolean = false;
  public isProd: boolean = baseURL === env.prod ? true : false;
  dateFilter!: DateRange | undefined;

  constructor(
    private _metricsService: MetricsService,
    private _downloadPrintService: DownloadPrintService
  ) {}

  ngOnInit() {
    this.getDataBasedOnEnv();
  }

  getDataBasedOnEnv() {
    try {
      this.getMetricsData(environment.value as EnvType);
    } catch (err) {
      this.showError = true;
    }
  }

  public getMetricsData(type: EnvType) {
    this.envName = this.selectedEnv = type;
    this.memberFilter = undefined;
    try {
      this._metricsService
        .getMetricsData(`${env[type]}${publicApi}`, undefined, this.dateFilter)
        .subscribe(
          (res: any) => {
            if (res?.data?.isSuccess) {
              this.metricsData = res.data.value;
              this.filterApplied = false;
              this.showError = false;
            }
            this.showButtons = true;
          },
          (error) => {
            this.showButtons = false;
            this.showError = true;
          }
        );
    } catch (err) {
      this.showButtons = false;
      this.showError = true;
    }
  }

  public downloadPDF(type: boolean) {
    this._downloadPrintService.downloadPDF('metrics-data', 'appMetrics', type);
  }

  print(): void {
    const style = `
    table { width: 100%; }
    .space { width: 30%; }
    .pad-15 { padding-top: 15px; }
    .data-container {
      padding: 1.5rem;
      margin-top: 1rem;
      border: 1px solid #d1d1d18a;
      box-shadow: 2px 2px 5px #d1d1d18a;
    }
    @media print {
      div.page-break { break-after: page; }
    }
    `;
    this._downloadPrintService.print(
      'metrics-data',
      'Sydney Community App Metrics',
      style
    );
  }

  getDataForMember(selectedFilter: string) {
    this.memberFilter = selectedFilter;
    this._metricsService
      .getMetricsData(
        `${env[this.selectedEnv]}${publicApi}`,
        selectedFilter,
        this.dateFilter
      )
      .subscribe(
        (res: any) => {
          if (res?.data?.isSuccess) {
            this.metricsData = res.data.value;
            this.filterApplied = true;
          }
          this.showButtons = true;
          this.showError = false;
        },
        (error) => {
          this.showButtons = false;
          this.showError = true;
        }
      );
  }

  onSelectDate(dateRange: DateRange) {
    this.dateFilter = dateRange;
    this._metricsService
      .getMetricsData(
        env[this.selectedEnv] + publicApi,
        this.memberFilter,
        dateRange
      )
      .subscribe((res: any) => {
        if (res?.data?.isSuccess) {
          this.metricsData = res.data.value;
        }
      });
  }

  onDateReset() {
    this.dateFilter = undefined;
    this.memberFilter
      ? this.getDataForMember(this.memberFilter)
      : this.getDataBasedOnEnv();
  }
}
