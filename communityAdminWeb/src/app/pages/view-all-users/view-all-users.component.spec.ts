import { ComponentFixture, TestBed } from '@angular/core/testing';
import { imports } from 'src/app/tests/app.imports';

import { ViewAllUsersComponent } from './view-all-users.component';

describe('ViewAllUsersComponent', () => {
  let component: ViewAllUsersComponent;
  let fixture: ComponentFixture<ViewAllUsersComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: imports,
      declarations: [ ViewAllUsersComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ViewAllUsersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
