import { ComponentFixture, TestBed } from '@angular/core/testing';
import { imports } from 'src/app/tests/app.imports';

import { DraftContentComponent } from './draft-content.component';

describe('DraftContentComponent', () => {
  let component: DraftContentComponent;
  let fixture: ComponentFixture<DraftContentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: imports,
      declarations: [ DraftContentComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DraftContentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
