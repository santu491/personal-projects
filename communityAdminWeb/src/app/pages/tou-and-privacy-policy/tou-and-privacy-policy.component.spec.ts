import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TouAndPrivacyPolicyComponent } from './tou-and-privacy-policy.component';
import { imports } from 'src/app/tests/app.imports';

describe('TouAndPrivacyPolicyComponent', () => {
  let component: TouAndPrivacyPolicyComponent;
  let fixture: ComponentFixture<TouAndPrivacyPolicyComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: imports,
      declarations: [ TouAndPrivacyPolicyComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TouAndPrivacyPolicyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
