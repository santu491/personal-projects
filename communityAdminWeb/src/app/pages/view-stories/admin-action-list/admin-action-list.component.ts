import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { collections, roleAccess, roles } from 'src/app/core/constants';
import { FlagStory, StoryResponse } from 'src/app/core/models/story';
import { rolePermissionsValidation } from 'src/app/core/utils';

@Component({
  selector: 'app-admin-action-list',
  templateUrl: './admin-action-list.component.html',
  styleUrls: ['./admin-action-list.component.scss']
})
export class AdminActionListComponent implements OnInit {
  public flagged: boolean = false;
  public removed: boolean = false;
  public ignore: boolean = false;
  public rolePermission = localStorage.getItem("rolePermissions");
  public currentUser = localStorage.getItem('id');
  public isAdvocate: boolean = (localStorage.getItem('role') === roles[1].role);
  public view = rolePermissionsValidation(this.rolePermission, collections.STORY, roleAccess[0], );
  public edit = rolePermissionsValidation(this.rolePermission, collections.STORY, roleAccess[1], );
  public delete = rolePermissionsValidation(this.rolePermission, collections.STORY, roleAccess[2], );

  @Input() story!: StoryResponse;
  @Output() removeStory = new EventEmitter<StoryResponse>();
  @Output() reportStory = new EventEmitter<FlagStory>();
  @Output() banUser = new EventEmitter<StoryResponse>();
  @Input() modalView: boolean = false;

  constructor() { }

  ngOnInit(): void {
    this.init();
  }

  ngOnChanges(): void {
    this.init();
  }

  remove() {
    this.removeStory.emit(this.story);
  }

  report(flag: boolean) {
    this.reportStory.emit({story: this.story, flagged: flag});
  }

  ban() {
    this.banUser.emit(this.story);
  }

  init() {
    const storyValue = this.story;
    if(storyValue) {
      this.flagged = storyValue.flagged;
      this.removed = storyValue.removed;
    }
  } 
}
