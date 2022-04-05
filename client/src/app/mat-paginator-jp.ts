import { MatPaginatorIntl } from '@angular/material/paginator';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})

export class MatPaginatorIntlJa extends MatPaginatorIntl {
  override itemsPerPageLabel = '件数';
  override nextPageLabel     = '次へ';
  override previousPageLabel = '戻る';

  override getRangeLabel = (page: number, pageSize: number, length: number) => {
    if (length === 0 || pageSize === 0) { return `${length} 件中 0`; }

    length = Math.max(length, 0);

    const startIndex = page * pageSize;

    const endIndex = startIndex < length ?
      Math.min(startIndex + pageSize, length) :
      startIndex + pageSize;

    return `全 ${length} 件中 ${startIndex + 1} - ${endIndex} 件表示`;
  }
}