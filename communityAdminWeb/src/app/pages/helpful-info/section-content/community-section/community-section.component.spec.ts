import { ComponentFixture, TestBed } from '@angular/core/testing';

import { imports } from 'src/app/tests/app.imports';
import { CommunitySectionComponent } from './community-section.component';

describe('CommunitySectionComponent', () => {
  let component: CommunitySectionComponent;
  let fixture: ComponentFixture<CommunitySectionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: imports,
      declarations: [CommunitySectionComponent]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CommunitySectionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
