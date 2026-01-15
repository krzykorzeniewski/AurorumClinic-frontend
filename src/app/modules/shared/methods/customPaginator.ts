import { MatPaginatorIntl } from '@angular/material/paginator';

export function customPaginator() {
  const paginatorIntl = new MatPaginatorIntl();
  paginatorIntl.itemsPerPageLabel = 'Wybierz ilość widocznych elementów';
  paginatorIntl.nextPageLabel = 'Następna';
  paginatorIntl.previousPageLabel = 'Poprzednia';
  paginatorIntl.firstPageLabel = 'Pierwsza';
  paginatorIntl.lastPageLabel = 'Ostatnia';
  return paginatorIntl;
}
