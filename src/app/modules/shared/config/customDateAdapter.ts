import { Injectable } from '@angular/core';
import { NativeDateAdapter } from '@angular/material/core';

@Injectable()
export class CustomDateAdapter extends NativeDateAdapter {
  override parse(value: string, parseFormat: string): Date | null {
    if (parseFormat === 'HH:mm') {
      const [hours, minutes] = value.split(':').map(Number);
      const date = new Date();
      date.setHours(hours, minutes, 0, 0);
      return date;
    }

    if (parseFormat === 'DD.MM.YYYY') {
      const [day, month, year] = value.split('.').map(Number);
      return new Date(year, month - 1, day);
    }

    return super.parse(value);
  }

  override format(date: Date, displayFormat: any): string {
    if (displayFormat === 'DD.MM.YYYY') {
      const day = date.getDate().toString().padStart(2, '0');
      const month = (date.getMonth() + 1).toString().padStart(2, '0');
      const year = date.getFullYear();
      return `${day}.${month}.${year}`;
    }

    if (displayFormat === 'HH:mm') {
      const hours = date.getHours().toString().padStart(2, '0');
      const minutes = date.getMinutes().toString().padStart(2, '0');
      return `${hours}:${minutes}`;
    }

    return super.format(date, displayFormat);
  }
}
