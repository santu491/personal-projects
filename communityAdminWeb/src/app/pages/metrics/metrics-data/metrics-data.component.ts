import { Component, Input, OnInit } from '@angular/core';
import { EnvType } from 'src/app/core/constants';
import { Filter } from 'src/app/core/models';
import { baseURL, env } from 'src/environments/environment';
import { MetricsHelperService } from '../metrics-helper.service';

@Component({
  selector: 'app-metrics-data',
  templateUrl: './metrics-data.component.html',
  styleUrls: ['./metrics-data.component.scss'],
})
export class MetricsDataComponent implements OnInit {
  @Input() metricsData!: any;
  @Input() filterApplied: boolean = false;
  public isProd: boolean = baseURL === env.prod ? true : false;

  @Input('envName') envName: EnvType = this.isProd ? 'prod' : 'sit';

  medicaidTotalUsers = 0;
  medicaidMarkets: any[] = [];
  usersPerCommunity: any[] = [];
  storiesPerCommunity: any[] = [];
  unpublishedStoriesPerCommunity: any[] = [];

  constructor(private _metricsHelperService: MetricsHelperService) {}

  ngOnInit(): void {}

  ngOnChanges(): void {
      if(!this.metricsData) {
        return;
      }
      //Set Medicaid Data
      if(!this.filterApplied) {
        this.setMedicaidTotal(this.metricsData?.usersCount?.medicaidUsers);
        this._metricsHelperService.getMemberTypes(this.envName, () => {
          this.medicaidMarkets = [];
          const markets: Filter[] = this._metricsHelperService.marketBrandOptions;
          markets.forEach((market) => {
            if (market.value in this.metricsData?.usersCount?.medicaidUsers) {
              this.medicaidMarkets.push({
                title: market.title,
                value: this.metricsData?.usersCount?.medicaidUsers[market.value],
              });
            }
          });
        });
        
      }
      else {
        this.medicaidMarkets = [];
      }

      //Sort Community Users
      this.usersPerCommunity = this.metricsData?.usersByCommunity;
      this._metricsHelperService.sortMarketBrand(this.usersPerCommunity);

      //Sort Community Stories
      if(this.metricsData?.publishedStoriesCount > 0) {
        this.storiesPerCommunity = this.metricsData?.storiesPerCommunity;
        this._metricsHelperService.sortMarketBrand(this.storiesPerCommunity);
      }      

      //Sort Community Unpublished Stories
      if(this.metricsData?.unPublishedStoriesCount > 0) {
        this.unpublishedStoriesPerCommunity = this.metricsData?.unPublishedStoriesPerCommunity;
        this._metricsHelperService.sortMarketBrand(this.unpublishedStoriesPerCommunity);
      }
  }

  setMedicaidTotal(userData: any) {
    const valueArray = Object.values(userData);
    this.medicaidTotalUsers = valueArray.reduce(
      (accumulator: number, value: any) => {
        return accumulator + value;
      },
      0
    );
  }
}
