import {
  HttpEvent,
  HttpHandler,
  HttpInterceptor,
  HttpRequest,
} from "@angular/common/http";
import { Injectable } from "@angular/core";
import { NgxSpinnerService } from "ngx-spinner";
import { Observable } from "rxjs";
import { finalize } from "rxjs/operators";

@Injectable()
export class HttpLoadingInterceptor implements HttpInterceptor {
  constructor(private spinner: NgxSpinnerService) {}

  intercept(
    request: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {
    this.spinner.show();
    return next.handle(request).pipe(
      finalize(() => {
        this.spinner.hide();
      })
    ) as Observable<HttpEvent<any>>;
  }
}
