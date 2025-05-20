import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'filter'
})
export class FilterPipe implements PipeTransform {
  transform(items: any[], searchText: string): any[] {
    if (!items) {
      return [];
    }
    if (!searchText) {
      return items;
    }
    searchText = searchText.toLocaleLowerCase();

    const filteredData = items.filter((it) => {
      return it.toLocaleLowerCase().includes(searchText);
    });
    return filteredData.length > 0
      ? filteredData
      : [{ message: 'data not available' }];
  }
}
