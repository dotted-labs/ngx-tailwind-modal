import { Component, OnInit, OnDestroy, signal, computed } from '@angular/core';
import { NgxTailwindModalViewComponent } from './ngx-tailwind-modal-view.component';

export interface IInfoModalData {
  title?: string;
  message: string;
  buttonText?: string;
  variant?: 'success' | 'error' | 'warning' | 'info';
  icon?: string;
  autoCloseTimer?: number; // in milliseconds
}

@Component({
  selector: 'ngx-info-modal',
  standalone: true,
  template: `
    <div class="flex items-start gap-4">
      @if (modalData()?.icon || hasDefaultIcon()) {
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

        <p class="py-2 text-sm text-base-content/80">
          {{ modalData()?.message }}
        </p>

        @if (autoCloseTimer() && autoCloseTimer()! > 0) {
          <p class="text-xs text-base-content/50 mt-2">Auto-closing in {{ autoCloseCountdown() }} seconds...</p>
        }
      </div>
    </div>

    <div class="modal-action justify-end mt-6">
      <button type="button" [class]="buttonClasses()" (click)="onClose()">
        {{ modalData()?.buttonText || 'OK' }}
      </button>
    </div>
  `,
})
export class InfoModalComponent extends NgxTailwindModalViewComponent implements OnInit, OnDestroy {
  modalData = signal<IInfoModalData | undefined>(undefined);
  autoCloseTimer = signal<number | undefined>(undefined);
  autoCloseCountdown = signal<number>(0);
  private countdownInterval?: number;

  // Computed signals for reactive styling
  hasDefaultIcon = computed(() => !!this.modalData()?.variant);

  iconClasses = computed(() => {
    const variant = this.modalData()?.variant || 'info';
    const baseClasses = 'w-12 h-12 rounded-full flex items-center justify-center';

    switch (variant) {
      case 'success':
        return `${baseClasses} bg-success/20 text-success`;
      case 'error':
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
      case 'error':
        return 'text-error';
      case 'warning':
        return 'text-warning';
      case 'info':
      default:
        return 'text-info';
    }
  });

  buttonClasses = computed(() => {
    const variant = this.modalData()?.variant || 'info';

    switch (variant) {
      case 'success':
        return 'btn btn-success';
      case 'error':
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
      case 'error':
        return 'M6 18L18 6M6 6l12 12';
      case 'warning':
        return 'M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z';
      case 'info':
      default:
        return 'M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z';
    }
  });

  ngOnInit() {
    const data = this.modalInstance.getData() as IInfoModalData;
    this.modalData.set(data);
    this.autoCloseTimer.set(data?.autoCloseTimer);

    const timer = this.autoCloseTimer();
    if (timer && timer > 0) {
      this.startAutoCloseTimer();
    }
  }

  ngOnDestroy() {
    if (this.countdownInterval) {
      clearInterval(this.countdownInterval);
    }
  }

  onClose() {
    if (this.countdownInterval) {
      clearInterval(this.countdownInterval);
    }
    this.modalInstance.close();
  }

  private startAutoCloseTimer() {
    const timer = this.autoCloseTimer();
    if (!timer) return;

    this.autoCloseCountdown.set(Math.ceil(timer / 1000));

    this.countdownInterval = window.setInterval(() => {
      const current = this.autoCloseCountdown();
      const newValue = current - 1;
      this.autoCloseCountdown.set(newValue);

      if (newValue <= 0) {
        this.onClose();
      }
    }, 1000);

    setTimeout(() => {
      this.onClose();
    }, timer);
  }
}
