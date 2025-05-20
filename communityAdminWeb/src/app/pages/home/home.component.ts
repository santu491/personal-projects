import { Component, OnInit } from '@angular/core';
import { Chart, registerables } from 'chart.js';
import { homeModule } from 'src/app/core/defines';
Chart.register(...registerables);
@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {
  public homeModule = homeModule;

  ngOnInit(): void {}
}
