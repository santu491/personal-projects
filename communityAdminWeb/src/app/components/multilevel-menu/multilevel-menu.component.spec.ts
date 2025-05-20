import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MultilevelMenuService } from 'ng-material-multilevel-menu';
import { imports } from 'src/app/tests/app.imports';

import { MultilevelMenuComponent } from './multilevel-menu.component';

describe('MultilevelMenuComponent', () => {
  let component: MultilevelMenuComponent;
  let fixture: ComponentFixture<MultilevelMenuComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: imports,
      providers: [ MultilevelMenuService ],
      declarations: [ MultilevelMenuComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MultilevelMenuComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
