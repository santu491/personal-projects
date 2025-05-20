import { ComponentFixture, TestBed } from "@angular/core/testing";
import { imports } from "src/app/tests/app.imports";
import { AddUserComponent } from "./add-user.component";

describe("AddUserComponent", () => {
  let component: AddUserComponent;
  let fixture: ComponentFixture<AddUserComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: imports,
      declarations: [AddUserComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AddUserComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
