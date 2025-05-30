export const NgxTailwindModalConfig = {
  bodyClassOpen: 'dialog-open',
  prefixEvent: 'ngx-tailwind-modal.',
};

export interface INgxTailwindModalOptions {
  closable?: boolean;
  escapable?: boolean;
  dismissable?: boolean;
  customClass?: string;
  backdrop?: boolean;
  force?: boolean;
  hideDelay?: number;
  autostart?: boolean;
  target?: string;
  ariaLabel?: string;
  ariaLabelledBy?: string;
  ariaDescribedBy?: string;
  refocus?: boolean;
}
