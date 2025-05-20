import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterTestingModule } from '@angular/router/testing';
import { ToastrModule } from 'ngx-toastr';

import { AddCommunityComponent } from './add-community.component';
import { imports } from 'src/app/tests/app.imports';

describe('AddCommunityComponent', () => {
  let component: AddCommunityComponent;
  let fixture: ComponentFixture<AddCommunityComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: imports,
      declarations: [ AddCommunityComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AddCommunityComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
