import { pageParam } from '@anthem/communityapi/common';
import { IsInt } from 'class-validator';

export class PageParam {
  @IsInt() pageNumber: number;
  @IsInt() pageSize: number;
  @IsInt() sort: number;
}

export class PageParamModel {
  pageNumber = 1;
  pageSize = 10;
  sort = -1;

  public setPageNumber(value) {
    this.pageNumber = value < 1 ? 1 : value;
  }

  public setPageSize(value) {
    this.pageSize = value > pageParam.maxPageSize ? pageParam.maxPageSize : value;
  }
}
