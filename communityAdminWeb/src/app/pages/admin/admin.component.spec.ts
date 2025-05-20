import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminComponent } from './admin.component';
import { imports } from 'src/app/tests/app.imports';
import { mockLocalStorage } from 'src/app/tests/mocks/mockLocalStorage';

describe('AdminComponent', () => {
  let component: AdminComponent;
  let fixture: ComponentFixture<AdminComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: imports,
      declarations: [AdminComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    spyOn(localStorage, 'getItem')
    .and.callFake(mockLocalStorage.getItem);
    fixture = TestBed.createComponent(AdminComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
