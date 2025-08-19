export const NgxTailwindModalConfig = {
  bodyClassOpen: 'dialog-open',
  prefixEvent: 'ngx-tailwind-modal.',
};

export type ModalDisplayMode = 'modal' | 'sidebar';
export type SidebarPosition = 'left' | 'right';

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
  // Sidebar options
  displayMode?: ModalDisplayMode;
  sidebarPosition?: SidebarPosition;
  sidebarWidth?: string;
}
