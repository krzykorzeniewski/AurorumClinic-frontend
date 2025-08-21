import { Component, ElementRef, inject, OnDestroy, OnInit, signal, ViewChild } from '@angular/core';
import { FormControl, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatError, MatFormField, MatInput, MatLabel } from '@angular/material/input';
import { NewsletterService } from '../../services/newsletter.service';
import { FormsService } from '../../services/forms.service';
import { MatButton } from '@angular/material/button';
import { NgIf } from '@angular/common';
import { debounceTime, finalize, Subscription, timer } from 'rxjs';

@Component({
  selector: 'app-footer',
  standalone: true,
  imports: [
    FormsModule,
    MatError,
    MatFormField,
    MatInput,
    MatLabel,
    MatError,
    ReactiveFormsModule,
    MatButton,
    NgIf
  ],
  templateUrl: './footer.component.html',
  styleUrl: './footer.component.css',
})
export class FooterComponent implements OnInit, OnDestroy{
  email = new FormControl<string>('', {
    validators: [
      Validators.email,
      Validators.maxLength(100),
    ],
    nonNullable: true
  });
  @ViewChild('newsletterSignup') emailInput!: ElementRef<HTMLInputElement>;
  private _newsletterService = inject(NewsletterService);
  private _formService = inject(FormsService);
  private sub$!: Subscription;
  message = signal('');
  private isButtonClicked = false;

  ngOnInit(): void {
    this.sub$ = this.email.valueChanges
      .pipe(debounceTime(8000))
      .subscribe(()=>{
        if(!this.isButtonClicked) this.clearErrors();
      });
  }

  signup(){
    if(this.email.value === '') return;
    this.isButtonClicked = true;
    this._newsletterService.signup(this.email.value)
      .pipe(finalize(() =>{
        this.clearErrorAfterSend();
      })).subscribe({
      next: () => {
        this.message.set('Pomyślnie zapisano do newslettera');
      },
      error: (err) => {
        this.message.set(err.message);
      }
    });
  }

  protected clearErrors(){
      this.emailInput.nativeElement.blur();
      this.message.set('');
      this.email.reset('', {emitEvent: false})
      this.email.updateValueAndValidity({ emitEvent: false });
  }

  private clearErrorAfterSend(){
    timer(5000).subscribe(() => {
      this.clearErrors();
    })
  }

  getErrorMessage(control: FormControl) {
    return this._formService.getErrorMessage(control);
  }

  ngOnDestroy(): void {
    this.sub$.unsubscribe();
  }
}
