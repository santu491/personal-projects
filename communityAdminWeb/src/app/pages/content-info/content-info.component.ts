import { Component, OnInit } from '@angular/core';
import { contentModule } from 'src/app/core/defines';
import { ContentInfoService } from './content-info.service';
@Component({
  selector: 'app-content-info',
  templateUrl: './content-info.component.html',
  styleUrls: ['./content-info.component.scss']
})
export class ContentInfoComponent implements OnInit {
  constructor(private _contentInfoService: ContentInfoService) {}
  public contentLabels = contentModule;
  badWords: string[] = [];
  sensitiveWords: string[] = [];
  public searchText: string = '';

  ngOnInit(): void {
    this.getLatestContentInfo();
  }

  getLatestContentInfo() {
    this._contentInfoService.getLatestContent('wordList').subscribe(
      (response: any) => {
        if (response.data.value) {
          this.badWords = response?.data?.value?.data?.badWords ?? [];
          this.sensitiveWords =
            response?.data?.value?.data?.sensitiveWords ?? [];
        }
      },
      (error) => {
        console.log('error....', error);
      }
    );
  }
}
