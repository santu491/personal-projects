import { ComponentFixture, TestBed } from '@angular/core/testing';
import { imports } from 'src/app/tests/app.imports';

import { ForceAppUpdateComponent } from './force-app-update.component';

describe('ForceAppUpdateComponent', () => {
  let component: ForceAppUpdateComponent;
  let fixture: ComponentFixture<ForceAppUpdateComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: imports,
      declarations: [ ForceAppUpdateComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ForceAppUpdateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
