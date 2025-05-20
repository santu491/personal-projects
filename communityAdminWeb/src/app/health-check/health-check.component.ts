import { Component, OnInit } from "@angular/core";
import { MatSelectChange } from "@angular/material/select";
import { MatTableDataSource } from "@angular/material/table";
import { ToastrService } from "ngx-toastr";
import { communityData, generic, appGrp, envGrp, SearchFilter } from "src/app/core/constants";
import { homeModule } from "src/app/core/defines";
import { helpLinks } from "src/app/core/helpLinks";
import { MonitoringElement } from "src/app/core/models";
import { MetricsService } from "../pages/metrics/metrics.service";
@Component({
  selector: "app-health-check",
  templateUrl: "./health-check.component.html",
  styleUrls: ["./health-check.component.scss"],
})
export class HealthCheckComponent implements OnInit {
  public homeModule = homeModule;
  public displayedColumns: string[] = ["position", "url", "version", "status"];
  public appGrp = appGrp;
  public envGrp = envGrp;
  public envGroup: string = "";
  public appGroup: string = "";
  public defaultValue = "All";
  public toolsList = helpLinks;
  public role = localStorage.getItem("role");
  public dataSrc = communityData;
  statusFilter: SearchFilter[]=[];
  filterDictionary= new Map<string,string>();
  communityDataSrcFilters = new MatTableDataSource(communityData);



  constructor(
    private _metricsService: MetricsService,
    private _toastService: ToastrService
  ) {}

  public callCommEndpoints = () => {
    this.dataSrc.forEach((data) => {
      if(data.appGrp === "PROXY"){
        this.callAndUpdateProxyStatus(data);
      }
      this.callAndUpdateVersion(data);
    });
  };

  public callAndUpdateProxyStatus(data: MonitoringElement) {
    try {
      if (data && data.url) {
        this._metricsService.getVersion(data.url).subscribe(
          (res: any) => {
            if (res) {
              data.status = res.ok;
              data.version = res.body;
            }
          },
          (_error: any) => {
            this._toastService.error(generic.errorMessage);
          }
        );
      }
    } catch (err) {
      this._toastService.error(generic.errorMessage);
    }
  }

  public callAndUpdateVersion(data: MonitoringElement) {
    try {
      if (data && data.url) {
        this._metricsService.getVersion(data.url).subscribe(
          (res: any) => {
            if (res) {
              data.status = res.ok;
              data.version = res.body;
            }
          }
        );
      }
    } catch (err) {
      this._toastService.error(generic.errorMessage);
    }
  }

  ngOnInit(): void {
    this.statusFilter.push({name:'envGrp',options:this.envGrp,defaultValue:this.defaultValue, displayName:"Environment"});
    this.statusFilter.push({name:'appGrp',options:this.appGrp,defaultValue:this.defaultValue, displayName:"Application"});
    this.communityDataSrcFilters.filterPredicate = function (record,filter) {
      let map = new Map(JSON.parse(filter));
      let isMatch = false;
      for(let [key,value] of map){
        isMatch = (value=="ALL") || (record[key as keyof MonitoringElement] == value); 
        if(!isMatch) return false;
      }
      return isMatch;
    }
    Promise.all([this.callCommEndpoints()]);
  }

  applySrhFilter(ob:MatSelectChange,srcFilter:SearchFilter) {
    this.filterDictionary.set(srcFilter.name,ob.value);
    let jsonString = JSON.stringify(Array.from(this.filterDictionary.entries()));
    this.communityDataSrcFilters.filter = jsonString;
  }
}
