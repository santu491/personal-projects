import { ComponentFixture, TestBed } from '@angular/core/testing';

import { imports } from 'src/app/tests/app.imports';
import { CommonLibViewComponent } from './common-lib-view.component';

describe('CommonLibViewComponent', () => {
  let component: CommonLibViewComponent;
  let fixture: ComponentFixture<CommonLibViewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: imports,
      declarations: [CommonLibViewComponent]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CommonLibViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
