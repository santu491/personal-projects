import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { RouterTestingModule } from '@angular/router/testing';
import { ToastrModule } from 'ngx-toastr';
import { CustomMaterialModule } from '../custom-material.module';
import { AngularEditorModule } from '@kolkov/angular-editor';

export const imports = [
  RouterTestingModule,
  HttpClientTestingModule,
  ToastrModule.forRoot(),
  ReactiveFormsModule,
  CustomMaterialModule,
  NoopAnimationsModule,
  FormsModule,
  AngularEditorModule
];
