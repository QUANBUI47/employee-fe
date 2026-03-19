import { CommonModule } from '@angular/common';
import {
  Component,
  EventEmitter,
  forwardRef,
  Input,
  OnChanges,
  OnInit,
  Output,
  SimpleChanges,
} from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { FloatLabelModule } from 'primeng/floatlabel';
import { InputTextModule } from 'primeng/inputtext';

@Component({
  selector: 'app-cus-input',
  templateUrl: './cus-input.html',
  styleUrl: './cus-input.css',
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => CusInput),
      multi: true,
    },
  ],
  standalone: true,
  imports: [InputTextModule, FloatLabelModule, CommonModule],
})
export class CusInput implements ControlValueAccessor, OnInit, OnChanges {
  @Input() id = '';
  @Input() label = '';
  @Input() type = 'text';
  @Input() disabled = false;
  @Input() classInput = '';
  @Input() error: string | null = null;
  @Input() maxlength: number | null = null;
  @Input() tabindex: string | number = 0;
  // Optional input filtering and casing
  @Input() allowedPattern: string | null = null; // regex for DISALLOWED chars, will be removed
  @Input() uppercase = false;

  @Output() blurInput = new EventEmitter();
  @Output() changeInput = new EventEmitter();
  @Output() focusInput = new EventEmitter();

  value = '';
  onChange: (value: string) => void = () => {
    // Empty function
  };
  onTouched: () => void = () => {
    // Empty function
  };

  ngOnInit() {
    // Generate unique ID if not provided
    if (!this.id) {
      this.id = `input-${Math.random().toString(36).substr(2, 9)}`;
    }
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['disabled']) {
      this.disabled = changes['disabled'].currentValue;
    }
    if (changes['value']) {
      this.value = changes['value'].currentValue || '';
    }
  }

  writeValue(value: string): void {
    this.value = value || '';
  }

  registerOnChange(fn: (value: string) => void): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: () => void): void {
    this.onTouched = fn;
  }

  setDisabledState(isDisabled: boolean): void {
    this.disabled = isDisabled;
  }

  onInputFocus(): void {
    if (this.uppercase && this.value) {
      const upperValue = this.value.toUpperCase();
      if (upperValue !== this.value) {
        this.value = upperValue;
        this.onChange(upperValue);
      }
    }

    // Special handling for taxCode type - ensure proper formatting on focus
    if (this.type === 'taxCode' && this.value) {
      const formattedValue = this.formatTaxCode(this.value);
      if (formattedValue !== this.value) {
        this.value = formattedValue;
        this.onChange(formattedValue);
      }
    }

    this.focusInput.emit();
  }

  onInputChange(event: Event): void {
    let value = (event.target as HTMLInputElement).value;

    if (this.uppercase) value = value.toUpperCase();

    if (this.allowedPattern) {
      try {
        const re = new RegExp(this.allowedPattern, 'gu');
        const filtered = value.replace(re, '');
        if (filtered !== value) {
          value = filtered;
          (event.target as HTMLInputElement).value = filtered;
        }
      } catch {
        // ignore invalid regex
      }
    }

    // Special handling for taxCode type
    if (this.type === 'taxCode') {
      value = this.formatTaxCode(value);
      (event.target as HTMLInputElement).value = value;
    }

    this.value = value;
    this.onChange(value);
    this.changeInput.emit();
  }

  onInputBlur(): void {
    // Trim value when user leaves the input field
    let trimmedValue = this.value.trim();

    // Special handling for taxCode type - apply formatting on blur
    if (this.type === 'taxCode') {
      trimmedValue = this.formatTaxCode(trimmedValue);
    }

    this.value = trimmedValue;
    this.onChange(trimmedValue);
    this.onTouched();
    this.blurInput.emit();
  }

  onPaste(event: ClipboardEvent): void {
    event.preventDefault();
    const pastedText = event.clipboardData?.getData('text/plain') ?? '';
    const input = event.target as HTMLInputElement;
    const selectionStart = input.selectionStart ?? this.value.length;
    const selectionEnd = input.selectionEnd ?? this.value.length;

    const beforeSelection = this.value.slice(0, selectionStart);
    const afterSelection = this.value.slice(selectionEnd);

    let textToInsert = pastedText;

    // Apply allowedPattern filtering to pasted text (remove disallowed characters)
    if (this.allowedPattern) {
      try {
        const re = new RegExp(this.allowedPattern, 'gu');
        textToInsert = textToInsert.replace(re, '');
      } catch {
        // ignore invalid regex
      }
    }
    if (this.maxlength !== null && this.maxlength !== undefined) {
      const selectedLength = selectionEnd - selectionStart;
      const currentLengthExcludingSelection =
        this.value.length - selectedLength;
      const remainingCapacity =
        this.maxlength - currentLengthExcludingSelection;
      if (remainingCapacity <= 0) {
        textToInsert = '';
      } else if (textToInsert.length > remainingCapacity) {
        textToInsert = textToInsert.slice(0, remainingCapacity);
      }
    }

    let newValue = beforeSelection + textToInsert + afterSelection;

    // Special handling for taxCode type on paste
    if (this.type === 'taxCode') {
      newValue = this.formatTaxCode(newValue);
    }

    this.value = newValue;
    this.onChange(newValue);
    this.changeInput.emit();
  }

  /**
   * Formats tax code input:
   * - Removes non-digit characters except dash
   * - Limits to 14 characters maximum
   * - Auto-inserts dash after 10th digit for format: 1234567890-123
   */
  private formatTaxCode(input: string): string {
    // Remove all characters except digits and dash
    const cleaned = input.replace(/[^0-9-]/g, '');

    // Remove existing dashes to rebuild the format
    const digitsOnly = cleaned.replace(/-/g, '');

    // Limit to 13 digits maximum
    const limitedDigits = digitsOnly.slice(0, 13);

    // Auto-format: add dash after 10th digit if we have more than 10 digits
    if (limitedDigits.length > 10) {
      return limitedDigits.slice(0, 10) + '-' + limitedDigits.slice(10);
    }

    return limitedDigits;
  }
}
