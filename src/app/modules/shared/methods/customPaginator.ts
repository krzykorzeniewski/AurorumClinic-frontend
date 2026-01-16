import { MatPaginatorIntl } from '@angular/material/paginator';

export function customPaginator() {
  const paginatorIntl = new MatPaginatorIntl();
  paginatorIntl.itemsPerPageLabel = 'Wybierz ilość widocznych elementów';
  paginatorIntl.nextPageLabel = 'Następna';
  paginatorIntl.previousPageLabel = 'Poprzednia';
  paginatorIntl.firstPageLabel = 'Pierwsza';
  paginatorIntl.lastPageLabel = 'Ostatnia';

  paginatorIntl.getRangeLabel = (
    page: number,
    pageSize: number,
    length: number,
  ) => {
    if (length === 0 || pageSize === 0) {
      return `Strona 0 z 0`;
    }
    const totalPages = Math.ceil(length / pageSize);
    const currentPage = page + 1;
    return `Strona ${currentPage} z ${totalPages}`;
  };
  return paginatorIntl;
}
