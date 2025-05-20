import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ModerateComponent } from './moderate.component';
import { mockLocalStorage } from 'src/app/tests/mocks/mockLocalStorage';

describe('ModerateComponent', () => {
  let component: ModerateComponent;
  let fixture: ComponentFixture<ModerateComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ModerateComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    spyOn(localStorage, 'getItem')
    .and.callFake(mockLocalStorage.getItem);
    fixture = TestBed.createComponent(ModerateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
