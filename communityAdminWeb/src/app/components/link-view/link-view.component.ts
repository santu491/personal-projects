import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-link-view',
  templateUrl: './link-view.component.html',
  styleUrls: ['./link-view.component.scss']
})
export class LinkViewComponent implements OnInit {
  @Input() linkContent: any;

  constructor() {}

  ngOnInit(): void {}
}
