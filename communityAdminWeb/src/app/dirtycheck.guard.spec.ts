import { TestBed } from "@angular/core/testing";
import { DirtyCheckGuard } from "./dirtycheck.guard";

describe("DirtyCheckGuard", () => {
  let guard: DirtyCheckGuard;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    guard = TestBed.inject(DirtyCheckGuard);
  });

  it("should be created", () => {
    expect(guard).toBeTruthy();
  });
});
