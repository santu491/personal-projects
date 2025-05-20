import { ComponentFixture, TestBed } from '@angular/core/testing';
import { adminModule } from 'src/app/core/defines';
import { imports } from 'src/app/tests/app.imports';

import { SidenavComponent } from './sidenav.component';

describe('SidenavComponent', () => {
  let component: SidenavComponent;
  let fixture: ComponentFixture<SidenavComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: imports,
      declarations: [SidenavComponent]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SidenavComponent);
    component = fixture.componentInstance;
    component.moduleDetails = {
      "sidenavHeader": "Engage with Community",
      "sidenavRouting": [
        {
          "btnName": "Communities",
          "children": [
            {
              "btnName": "Stories",
              "routerLink": "/ui/pages/engage/view-stories",
              "matIcon": "group",
              "routerLinkActive": "active"
            }
          ]
        },
        {
          "btnName": "Help",
          "routerLink": "/ui/pages/engage/help",
          "matIcon": "help_outline",
          "routerLinkActive": "active"
        }
      ]
    }
    
    fixture.detectChanges();
  });

  it('should create with admin module', () => {
    component.moduleDetails = adminModule;
    fixture.detectChanges();
    expect(component.moduleDetails).not.toBeNull();
  });
});
