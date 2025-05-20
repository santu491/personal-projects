import { ComponentFixture, TestBed } from '@angular/core/testing';

import { By } from '@angular/platform-browser';
import { imports } from 'src/app/tests/app.imports';
import { ReactionContainerComponent } from './reaction-container.component';

describe('ReactionContainerComponent', () => {
  let component: ReactionContainerComponent;
  let fixture: ComponentFixture<ReactionContainerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: imports,
      declarations: [ReactionContainerComponent]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ReactionContainerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should contain 4 reaction elements', () => {
    const btnContainerDe = fixture.debugElement.queryAll(
      By.css('.reaction-view')
    );
    expect(btnContainerDe.length).toBe(4);
  });
});
