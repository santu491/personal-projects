import { Component, OnInit, ViewChild } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { ToastrService } from 'ngx-toastr';
import { Templates } from 'src/app/core/models/notification';
import { NotificationComponetService } from './notification.service';
import { generic, messages, roles } from 'src/app/core/constants'
import Swal, { SweetAlertIcon } from 'sweetalert2';

@Component({
  selector: 'app-notification',
  templateUrl: './notification.component.html',
  styleUrls: ['./notification.component.scss']
})
export class NotificationComponent implements OnInit {

  dataSource!: MatTableDataSource<any>;
  userRole = localStorage.getItem('role');
  public isAdmin = this.userRole === roles[0].role || this.userRole === roles[2].role;
  public templates: any[] = [];
  public editData: Templates | undefined;;
  public showAddForm: boolean = false;
  public selectedItemIdex: number | undefined;
  

  constructor(
    private _notificationService: NotificationComponetService,
    private _toasterService: ToastrService
  ) {}

  ngOnInit(): void {
    this.getAllTemplates();
  }
  
  getAllTemplates() {
    this._notificationService.getAllPNTemplates().subscribe(
      (result: any) => {
        if (result.data.isSuccess) {
          if (result.data.value.length < 1) {
            this._toasterService.info(messages.pnTemplatesNotFound);
            return;
          }
          this.templates = result.data.value.pushNotificationTemplate.sort();
        }
      },
      (error: any) => {
        console.error(error);
        this._toasterService.error(generic.somethingWentWrong);
      }
    );
  }

  onEditClick(template: Templates, index: number) {
    this.selectedItemIdex = index;
    this.showAddForm = true;
    this.editData = template;
  }

  removePromptForm() {
    this.showAddForm = false;
    this.getAllTemplates();
  }

  showBadWordContentError(
    title: string,
    message: string,
    icon: SweetAlertIcon,
  ) {
    return Swal.fire({
      title: title,
      text: message,
      icon: icon
    });
  }

  updateTemplate(template: Templates) {
    if(!template.body || !template.title || !template.activityText) {
      this.showBadWordContentError("Invalid line", "Empty string is not allowed for Push Notification.", "error");
      return;
    }
    this._notificationService.updatePNTemplate(template, template.id).subscribe(
      (result: any) => {
        if (result.data.isSuccess) {
          this._toasterService.success(template.name + ' ' + messages.templateUpdate);
        }
      },
      (error: any) => {
        console.error(error);
        this._toasterService.error(generic.somethingWentWrong);
      }
    );
  }
}
