import { Component, OnInit } from '@angular/core';
import { CommunityService } from 'src/app/components/community-filter/community.service';
import { pnMetrics, viewAllPNModule } from 'src/app/core/defines';
import { FilterText, PNMetrics } from 'src/app/core/models';
import { BaseResponse } from 'src/app/core/models/response';
import { DownloadPrintService } from 'src/app/core/services/download-print.service';
import { PnMetricsService } from './pn-metrics.service';

@Component({
  selector: 'app-metrics-pn',
  templateUrl: './metrics-pn.component.html',
  styleUrls: ['./metrics-pn.component.scss']
})
export class MetricsPnComponent implements OnInit {
  metricsData!: PNMetrics;
  selectedCommunities: string[] = [];
  selectedCommunityIds: string[] = [];
  allUsersSelected = false;
  filter: FilterText = {
    text: '',
    communityText: ''
  };
  pnMetricsLiterals = pnMetrics;

  constructor(
    private _communityService: CommunityService,
    private _pnMetricsService: PnMetricsService,
    private _downloadPrintService: DownloadPrintService
  ) {}

  ngOnInit(): void {}

  getMetricsData() {
    this._pnMetricsService
      .getMetricsData(this.selectedCommunityIds)
      .subscribe((response: BaseResponse) => {
        if (response.data.isSuccess) {
          this.metricsData = <PNMetrics>response.data?.value;
        }
      });
  }

  onCommunitySelect(communities: string[]) {
    this.selectedCommunities = [];
    this.selectedCommunityIds = communities;
    if (communities.length !== 0) {
      for (const community of communities) {
        const communityData = this._communityService.communityList.find(
          (c) => c.id === community
        );
        this.selectedCommunities.push(
          communityData ? communityData.title : viewAllPNModule.noCommunity
        );
      }
      this.getMetricsData();
      this.allUsersSelected =
        this.selectedCommunities.length >
        this._communityService.communityList.length;
      this.setChosenFilterText(true);
    } else {
      this.allUsersSelected = false;
      this.filter.text = 'Select a community!';
      this.setChosenFilterText(false);
    }
  }

  setChosenFilterText(setValue: boolean) {
    if (!setValue) {
      this.filter.text = '';
      this.filter.communityText = '';
      return;
    }
    this.filter.text = 'For Users from communities - ';
    this.filter.communityText = '';
    for (const community of this.selectedCommunities) {
      if (community === viewAllPNModule.noCommunity) {
        if (this.selectedCommunities.length === 1) {
          this.filter.text = 'For Un Joined Users ';
          this.filter.communityText = '';
        }
        continue;
      }
      this.filter.communityText = this.filter.communityText.concat(
        ` ${community} |`
      );
    }
    this.filter.communityText = this.filter.communityText.substring(
      0,
      this.filter.communityText.length - 1
    );
  }

  downloadPdf() {
    this._downloadPrintService.downloadPDF('metrics-data', 'pn-metrics', true);
  }

  printMetrics() {
    this._downloadPrintService.print(
      'metrics-data',
      'Sydney Community PN Metrics'
    );
  }
}
