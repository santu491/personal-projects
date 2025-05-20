import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminContentComponent } from './admin-user.component';

describe('AdminContentComponent', () => {
  let component: AdminContentComponent;
  let fixture: ComponentFixture<AdminContentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ HttpClientTestingModule ],
      declarations: [ AdminContentComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AdminContentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
