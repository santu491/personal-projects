import { CUSTOM_ELEMENTS_SCHEMA } from "@angular/core";
import { ComponentFixture, TestBed } from "@angular/core/testing";
import { PagesComponent } from "./pages.component";

describe("PagesComponent", () => {
  let component: PagesComponent;
  let fixture: ComponentFixture<PagesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [PagesComponent],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PagesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
