import { Component, OnInit, signal, computed } from '@angular/core';
import { NgxTailwindModalViewComponent } from './ngx-tailwind-modal-view.component';

export interface IConfirmationModalData {
  title?: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  variant?: 'success' | 'danger' | 'warning' | 'info';
  icon?: string;
}

export interface IConfirmationModalResult {
  confirmed: boolean;
}

@Component({
  selector: 'ngx-confirmation-modal',
  standalone: true,
  template: `
    <div class="flex items-start gap-4">
      @if (modalData()?.icon) {
        <div class="flex-shrink-0">
          <div [class]="iconClasses()">
            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path [attr.d]="iconPath()" stroke-linecap="round" stroke-linejoin="round" stroke-width="2"></path>
            </svg>
          </div>
        </div>
      }

      <div class="flex-1">
        @if (modalData()?.title) {
          <h3 class="font-bold text-lg mb-2" [class]="titleClasses()">
            {{ modalData()?.title }}
          </h3>
        }

        <p class="py-2 text-sm text-base-content/70">
          {{ modalData()?.message }}
        </p>
      </div>
    </div>

    <div class="modal-action justify-end gap-3 mt-6">
      <button type="button" class="btn btn-ghost" (click)="onCancel()">
        {{ modalData()?.cancelText || 'Cancel' }}
      </button>

      <button type="button" [class]="confirmButtonClasses()" (click)="onConfirm()">
        {{ modalData()?.confirmText || 'Confirm' }}
      </button>
    </div>
  `,
})
export class ConfirmationModalComponent extends NgxTailwindModalViewComponent implements OnInit {
  modalData = signal<IConfirmationModalData | undefined>(undefined);

  // Computed signals for reactive styling
  iconClasses = computed(() => {
    const variant = this.modalData()?.variant || 'info';
    const baseClasses = 'w-12 h-12 rounded-full flex items-center justify-center';

    switch (variant) {
      case 'success':
        return `${baseClasses} bg-success/20 text-success`;
      case 'danger':
        return `${baseClasses} bg-error/20 text-error`;
      case 'warning':
        return `${baseClasses} bg-warning/20 text-warning`;
      case 'info':
      default:
        return `${baseClasses} bg-info/20 text-info`;
    }
  });

  titleClasses = computed(() => {
    const variant = this.modalData()?.variant || 'info';

    switch (variant) {
      case 'success':
        return 'text-success';
      case 'danger':
        return 'text-error';
      case 'warning':
        return 'text-warning';
      case 'info':
      default:
        return 'text-info';
    }
  });

  confirmButtonClasses = computed(() => {
    const variant = this.modalData()?.variant || 'info';

    switch (variant) {
      case 'success':
        return 'btn btn-success';
      case 'danger':
        return 'btn btn-error';
      case 'warning':
        return 'btn btn-warning';
      case 'info':
      default:
        return 'btn btn-primary';
    }
  });

  iconPath = computed(() => {
    const variant = this.modalData()?.variant || 'info';

    switch (variant) {
      case 'success':
        return 'M5 13l4 4L19 7';
      case 'danger':
        return 'M6 18L18 6M6 6l12 12';
      case 'warning':
        return 'M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z';
      case 'info':
      default:
        return 'M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z';
    }
  });

  ngOnInit() {
    this.modalData.set(this.modalInstance.getData() as IConfirmationModalData);
  }

  onConfirm() {
    const result: IConfirmationModalResult = { confirmed: true };
    this.modalInstance.setData(result);
    this.modalInstance.close();
  }

  onCancel() {
    const result: IConfirmationModalResult = { confirmed: false };
    this.modalInstance.setData(result);
    this.modalInstance.close();
  }
}
