import {
  AfterViewInit,
  Component,
  inject,
  OnDestroy,
  ViewChild,
} from '@angular/core';
import { DatePipe, Location } from '@angular/common';
import {
  MatCell,
  MatCellDef,
  MatColumnDef,
  MatHeaderCell,
  MatHeaderCellDef,
  MatHeaderRow,
  MatHeaderRowDef,
  MatNoDataRow,
  MatRow,
  MatRowDef,
  MatTable,
  MatTableDataSource,
} from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort, MatSortHeader } from '@angular/material/sort';
import { ReactiveFormsModule } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { map, merge, startWith, Subscription, switchMap } from 'rxjs';
import { NewsletterService } from '../../../../core/services/newsletter.service';
import { NewsletterMessageResponse } from '../../../../core/models/newsletter.model';

@Component({
  selector: 'app-newsletter-table',
  standalone: true,
  imports: [
    DatePipe,
    MatCell,
    MatCellDef,
    MatColumnDef,
    MatHeaderCell,
    MatHeaderRow,
    MatHeaderRowDef,
    MatPaginator,
    MatRow,
    MatRowDef,
    MatSort,
    MatSortHeader,
    MatTable,
    ReactiveFormsModule,
    MatNoDataRow,
    MatHeaderCellDef,
  ],
  templateUrl: './newsletter-table.component.html',
  styleUrl: './newsletter-table.component.css',
})
export class NewsletterTableComponent implements AfterViewInit, OnDestroy {
  private _newsletterService = inject(NewsletterService);
  private _snackBar = inject(MatSnackBar);
  private _location = inject(Location);
  private _router = inject(Router);
  scheduledDisplayedColumns: string[] = [
    'createdAt',
    'subject',
    'scheduledAt',
    'details',
  ];
  allDisplayedColumns: string[] = [
    'createdAt',
    'subject',
    'approved',
    'scheduledAt',
    'details',
  ];
  dataSourceScheduled!: MatTableDataSource<NewsletterMessageResponse>;
  dataSourceAll!: MatTableDataSource<NewsletterMessageResponse>;
  totalCountScheduled = 0;
  totalCountAll = 0;
  sub = new Subscription();

  @ViewChild('scheduled') paginatorScheduled!: MatPaginator;
  @ViewChild('all') paginatorAll!: MatPaginator;

  @ViewChild('scheduledSort', { read: MatSort }) sortScheduled!: MatSort;
  @ViewChild('allSort', { read: MatSort }) sortAll!: MatSort;

  constructor() {
    const navigation = this._router.getCurrentNavigation();
    if (navigation?.extras.state && navigation.extras.state['message']) {
      this._snackBar.open(navigation.extras.state['message'], 'zamknij', {
        duration: 5000,
        panelClass:
          navigation.extras.state['status'] === 'success'
            ? 'xxx-alert-info'
            : 'xxx-alert-error',
      });
    }
    this._location.replaceState(this._router.url);
  }

  ngAfterViewInit(): void {
    this.sortScheduled.sortChange.subscribe(
      () => (this.paginatorScheduled.pageIndex = 0),
    );

    this.sub.add(
      merge(this.sortScheduled.sortChange, this.paginatorScheduled.page)
        .pipe(
          startWith({}),
          switchMap(() =>
            this._newsletterService.getAllScheduled(
              this.paginatorScheduled.pageIndex,
              this.paginatorScheduled.pageSize,
              this.sortScheduled.active,
              this.sortScheduled.direction,
            ),
          ),
          map((res) => {
            this.totalCountScheduled = res.page.totalElements;
            return res.messagesScheduled;
          }),
        )
        .subscribe((messages) => {
          this.dataSourceScheduled = new MatTableDataSource(messages);
        }),
    );

    this.sortAll.sortChange.subscribe(() => {
      this.paginatorAll.pageIndex = 0;
    });

    this.sub.add(
      merge(this.sortAll.sortChange, this.paginatorAll.page)
        .pipe(
          startWith({}),
          switchMap(() =>
            this._newsletterService.getAllNotScheduledMessages(
              this.paginatorAll.pageIndex,
              this.paginatorAll.pageSize,
              this.sortAll.active,
              this.sortAll.direction,
            ),
          ),
          map((res) => {
            this.totalCountAll = res.page.totalElements;
            return res.messages;
          }),
        )
        .subscribe((messages) => {
          this.dataSourceAll = new MatTableDataSource(messages);
        }),
    );
  }

  onDetails(messageId: number) {
    console.log(messageId);
  }

  ngOnDestroy(): void {
    this.sub.unsubscribe();
  }
}
