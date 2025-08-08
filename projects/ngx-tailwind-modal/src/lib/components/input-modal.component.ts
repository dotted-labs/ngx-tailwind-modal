import { Component, OnInit, AfterViewInit, signal, computed } from '@angular/core';
import { NgxTailwindModalViewComponent } from './ngx-tailwind-modal-view.component';

export interface IInputModalData {
  title?: string;
  message: string;
  inputLabel?: string;
  inputPlaceholder?: string;
  confirmText?: string;
  cancelText?: string;
  inputType?: 'text' | 'email' | 'password' | 'number' | 'tel' | 'url';
  required?: boolean;
  minLength?: number;
  maxLength?: number;
  pattern?: string;
  defaultValue?: string;
}

export interface IInputModalResult {
  value: string | null;
  cancelled: boolean;
}

@Component({
  selector: 'ngx-input-modal',
  standalone: true,
  imports: [],
  template: `
    <div class="modal-box max-w-md">
      <div>
        @if (modalData()?.title) {
          <h3 class="font-bold text-lg mb-2">
            {{ modalData()?.title }}
          </h3>
        }
        
        <p class="py-2 text-sm text-base-content/80">
          {{ modalData()?.message }}
        </p>

        <div class="form-control mt-4">
          @if (modalData()?.inputLabel) {
            <label class="label">
              <span class="label-text">
                {{ modalData()?.inputLabel }}
                @if (modalData()?.required) {
                  <span class="text-error">*</span>
                }
              </span>
            </label>
          }
          
          <input 
            #inputElement
            [type]="modalData()?.inputType || 'text'"
            [placeholder]="modalData()?.inputPlaceholder || ''"
            [value]="inputValue()"
            (input)="onInputChange($event)"
            [attr.required]="modalData()?.required ? true : null"
            [attr.minlength]="modalData()?.minLength || null"
            [attr.maxlength]="modalData()?.maxLength || null"
            [attr.pattern]="modalData()?.pattern || null"
            class="input input-bordered w-full"
            [class.input-error]="showValidationError()"
            (keyup.enter)="onConfirm()" />
          
          @if (showValidationError()) {
            <label class="label">
              <span class="label-text-alt text-error">{{ validationErrorMessage() }}</span>
            </label>
          }
        </div>
      </div>
      
      <div class="modal-action justify-end gap-3 mt-6">
        <button 
          type="button"
          class="btn btn-ghost"
          (click)="onCancel()">
          {{ modalData()?.cancelText || 'Cancel' }}
        </button>
        
        <button 
          type="button"
          class="btn btn-primary"
          [disabled]="!isInputValid()"
          (click)="onConfirm()">
          {{ modalData()?.confirmText || 'Confirm' }}
        </button>
      </div>
    </div>
  `
})
export class InputModalComponent extends NgxTailwindModalViewComponent implements OnInit, AfterViewInit {
  modalData = signal<IInputModalData | undefined>(undefined);
  inputValue = signal<string>('');
  showValidationError = signal<boolean>(false);

  // Computed signals for validation
  isInputValid = computed(() => {
    const data = this.modalData();
    const value = this.inputValue().trim();
    
    // Check required
    if (data?.required && !value) {
      return false;
    }

    // Check minimum length
    if (data?.minLength && value.length < data.minLength) {
      return false;
    }

    // Check maximum length
    if (data?.maxLength && value.length > data.maxLength) {
      return false;
    }

    // Check pattern
    if (data?.pattern && value) {
      const regex = new RegExp(data.pattern);
      if (!regex.test(value)) {
        return false;
      }
    }

    // Type-specific validation
    if (value && data?.inputType) {
      switch (data.inputType) {
        case 'email': {
          const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
          if (!emailRegex.test(value)) {
            return false;
          }
          break;
        }
        case 'url': {
          try {
            new URL(value);
          } catch {
            return false;
          }
          break;
        }
        case 'number': {
          if (isNaN(Number(value))) {
            return false;
          }
          break;
        }
      }
    }

    return true;
  });

  validationErrorMessage = computed(() => {
    const data = this.modalData();
    const value = this.inputValue().trim();
    
    if (data?.required && !value) {
      return 'This field is required';
    }

    if (data?.minLength && value.length < data.minLength) {
      return `Minimum length is ${data.minLength} characters`;
    }

    if (data?.maxLength && value.length > data.maxLength) {
      return `Maximum length is ${data.maxLength} characters`;
    }

    if (data?.pattern && value) {
      return 'Invalid format';
    }

    if (value && data?.inputType) {
      switch (data.inputType) {
        case 'email':
          return 'Please enter a valid email address';
        case 'url':
          return 'Please enter a valid URL';
        case 'number':
          return 'Please enter a valid number';
        default:
          return 'Invalid input';
      }
    }

    return 'Invalid input';
  });

  ngOnInit() {
    const data = this.modalInstance.getData() as IInputModalData;
    this.modalData.set(data);
    this.inputValue.set(data?.defaultValue || '');
  }

  ngAfterViewInit() {
    // Auto-focus the input field
    setTimeout(() => {
      const inputElement = document.querySelector('input');
      if (inputElement) {
        inputElement.focus();
        if (this.inputValue()) {
          inputElement.select();
        }
      }
    }, 100);
  }

  onConfirm() {
    if (!this.isInputValid()) {
      this.showValidationError.set(true);
      return;
    }

    const result: IInputModalResult = { 
      value: this.inputValue().trim(), 
      cancelled: false 
    };
    this.modalInstance.setData(result);
    this.modalInstance.close();
  }

  onCancel() {
    const result: IInputModalResult = { 
      value: null, 
      cancelled: true 
    };
    this.modalInstance.setData(result);
    this.modalInstance.close();
  }

  onInputChange(event: Event) {
    const target = event.target as HTMLInputElement;
    this.inputValue.set(target.value);
    
    if (this.showValidationError()) {
      this.showValidationError.set(false);
    }
  }

}