import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ContentInfoComponent } from './content-info.component';
import { imports } from 'src/app/tests/app.imports';

describe('ContentInfoComponent', () => {
  let component: ContentInfoComponent;
  let fixture: ComponentFixture<ContentInfoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: imports,
      declarations: [ ContentInfoComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ContentInfoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
