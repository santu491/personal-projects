import { BreakpointObserver } from '@angular/cdk/layout';
import { FlatTreeControl } from '@angular/cdk/tree';
import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { MatSidenav } from '@angular/material/sidenav';
import {
  MatTreeFlatDataSource,
  MatTreeFlattener
} from '@angular/material/tree';
import { FlatRouterNode, RouterNode } from 'src/app/core/models/sideNav';

@Component({
  selector: 'app-sidenav',
  templateUrl: './sidenav.component.html',
  styleUrls: ['./sidenav.component.scss']
})
export class SidenavComponent implements OnInit {
  @ViewChild(MatSidenav)
  sidenav!: MatSidenav;

  @Input() moduleDetails: any;

  private _transformer = (node: RouterNode, level: number) => {
    const nodeObject: FlatRouterNode = {
      expandable: !!node.children && node.children.length > 0,
      name: node.btnName,
      level: level
    };
    if (node.routerLink) {
      nodeObject.routerLink = node.routerLink;
      nodeObject.matIcon = node.matIcon;
      nodeObject.routerLinkActive = node.routerLinkActive;
    }
    return nodeObject;
  };

  treeControl = new FlatTreeControl<FlatRouterNode>(
    (node) => node.level,
    (node) => node.expandable
  );
  treeFlattener = new MatTreeFlattener(
    this._transformer,
    (node) => node.level,
    (node) => node.expandable,
    (node) => node.children
  );
  dataSource = new MatTreeFlatDataSource(this.treeControl, this.treeFlattener);

  constructor(private observer: BreakpointObserver) {}

  hasChild = (_: number, node: FlatRouterNode) => node.expandable;

  ngOnInit(): void {
    this.dataSource.data = this.moduleDetails.sidenavRouting;
  }

  ngAfterViewInit() {
    setTimeout(() => {
      this.observer.observe(['(max-width: 800px)']).subscribe((res) => {
        if (res.matches) {
          this.sidenav.mode = 'over';
          this.sidenav.close();
        } else {
          this.sidenav.mode = 'side';
          this.sidenav.open();
        }
      });
    });
    for (const node of this.treeControl.dataNodes) {
      if (
        node.name === 'Communities' ||
        node.name === 'Posts' ||
        node.name === 'Manage Mobile App Users'
      ) {
        this.treeControl.expand(node);
      }
    }
  }
}
