import { Directive, HostListener, inject } from '@angular/core';
import { NgControl } from '@angular/forms';

@Directive({
  selector: '[appInputRef]',
  standalone: true,
})
export class InputRefDirective {
  private ngControl = inject(NgControl);

  @HostListener('blur')
  onBlur() {
    if (this.ngControl.control) {
      const currentValue = this.ngControl.control.value;
      if (typeof currentValue === 'string') {
        const trimmedValue = currentValue.replace(/\s+/g, ' ').trim();
        if (currentValue !== trimmedValue) {
          this.ngControl.control.setValue(trimmedValue);
        }
      }
    }
  }
}
