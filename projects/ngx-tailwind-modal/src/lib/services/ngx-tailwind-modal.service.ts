import { DOCUMENT, isPlatformBrowser } from '@angular/common';
import {
  ApplicationRef,
  createComponent,
  EmbeddedViewRef,
  Inject,
  Injectable,
  Injector,
  PLATFORM_ID,
  TemplateRef,
  Type,
} from '@angular/core';
import { NgxTailwindModalComponent } from '../components/ngx-tailwind-modal.component';
import { ModalInstance } from './modal-instance';
import { NgxTailwindModalStackService } from './ngx-tailwind-modal-stack.service';
import { INgxTailwindModalOptions, NgxTailwindModalConfig, ModalDisplayMode, SidebarPosition } from '../config/ngx-tailwind-modal.config';
import { NgxTailwindModalViewComponent } from '../components/ngx-tailwind-modal-view.component';
import { 
  ConfirmationModalComponent, 
  IConfirmationModalData, 
  IConfirmationModalResult 
} from '../components/confirmation-modal.component';
import { 
  InfoModalComponent, 
  IInfoModalData 
} from '../components/info-modal.component';
import { 
  InputModalComponent, 
  IInputModalData, 
  IInputModalResult 
} from '../components/input-modal.component';

export type Content<T> = string | TemplateRef<T> | Type<T>;

@Injectable({
  providedIn: 'root',
})
export class NgxTailwindModalService {
  private lastElementFocused: HTMLElement | null = null;

  constructor(
    private _appRef: ApplicationRef,
    private _injector: Injector,
    private _modalStack: NgxTailwindModalStackService,
    @Inject(DOCUMENT) private _document: Document,
    @Inject(PLATFORM_ID) private _platformId: object,
  ) {
    this._addEvents();
  }

  /**
   * Add a new modal instance. This step is essential and allows to retrieve any modal at any time.
   * It stores an object that contains the given modal identifier and the modal itself directly in the `modalStack`.
   *
   * @param modalInstance The object that contains the given modal identifier and the modal itself.
   * @param force Optional parameter that forces the overriding of modal instance if it already exists.
   * @returns nothing special.
   */
  public addModal(modalInstance: ModalInstance, force?: boolean): void {
    this._modalStack.addModal(modalInstance, force);
  }

  /**
   * Retrieve a modal instance by its identifier.
   *
   * @param id The modal identifier used at creation time.
   */
  public getModal(id: string): NgxTailwindModalComponent {
    return this._modalStack.getModal(id);
  }

  public getModalInstance(id: string): ModalInstance | undefined {
    return this._modalStack.getModalInstance(id);
  }

  /**
   * Open a given modal
   *
   * @param id The modal identifier used at creation time.
   * @param force Tell the modal to open top of all other opened modals
   */
  public open(id: string, force = false): boolean {
    const modalInstance = this.getModalInstance(id);
    if (modalInstance) {
      return this._openModal(modalInstance, force);
    }

    return false;
  }

  /**
   * Close a given modal
   *
   * @param id The modal identifier used at creation time.
   */
  public close(id: string): boolean {
    const modalInstance = this.getModalInstance(id);
    if (modalInstance) {
      return this._closeModal(modalInstance);
    }

    return false;
  }

  /**
   * Close all opened modals
   */
  public closeAll(): void {
    this.getOpenedModals().forEach((instance: ModalInstance) => {
      this._closeModal(instance);
    });
  }

  /**
   * Toggles a given modal
   * If the retrieved modal is opened it closes it, else it opens it.
   *
   * @param id The modal identifier used at creation time.
   * @param force Tell the modal to open top of all other opened modals
   */
  public toggle(id: string, force = false): boolean {
    const modalInstance = this.getModalInstance(id);
    if (modalInstance) {
      return this._toggleModal(modalInstance, force);
    }

    return false;
  }

  /**
   * Retrieve all the created modals.
   *
   * @returns an array that contains all modal instances.
   */
  public getModalStack(): ModalInstance[] {
    return this._modalStack.getModalStack();
  }

  /**
   * Retrieve all the opened modals. It looks for all modal instances with their `visible` property set to `true`.
   *
   * @returns an array that contains all the opened modals.
   */
  public getOpenedModals(): ModalInstance[] {
    return this._modalStack.getOpenedModals();
  }

  /**
   * Retrieve the opened modal with highest z-index.
   *
   * @returns the opened modal with highest z-index.
   */
  public getTopOpenedModal(): NgxTailwindModalComponent {
    return this._modalStack.getTopOpenedModal();
  }

  /**
   * Get the higher `z-index` value between all the modal instances. It iterates over the `ModalStack` array and
   * calculates a higher value (it takes the highest index value between all the modal instances and adds 1).
   * Use it to make a modal appear foreground.
   *
   * @returns a higher index from all the existing modal instances.
   */
  public getHigherIndex(): number {
    return this._modalStack.getHigherIndex();
  }

  /**
   * It gives the number of modal instances. It's helpful to know if the modal stack is empty or not.
   *
   * @returns the number of modal instances.
   */
  public getModalStackCount(): number {
    return this._modalStack.getModalStackCount();
  }

  /**
   * Remove a modal instance from the modal stack.
   *
   * @param id The modal identifier.
   * @returns the removed modal instance.
   */
  public removeModal(id: string): void {
    const modalInstance = this._modalStack.removeModal(id);
    if (modalInstance) {
      this._destroyModal(modalInstance.modal);
    }
  }

  /**
   * Associate data to an identified modal. If the modal isn't already associated to some data, it creates a new
   * entry in the `modalData` array with its `id` and the given `data`. If the modal already has data, it rewrites
   * them with the new ones. Finally if no modal found it returns an error message in the console and false value
   * as method output.
   *
   * @param data The data you want to associate to the modal.
   * @param id The modal identifier.
   * @param force If true, overrides the previous stored data if there was.
   * @returns true if the given modal exists and the process has been tried, either false.
   */
  public setModalData(data: unknown, id: string, force?: boolean): boolean {
    const modal = this.getModal(id);
    if (modal) {
      modal.setData(data, force);
      return true;
    } else {
      return false;
    }
  }

  /**
   * Retrieve modal data by its identifier.
   *
   * @param id The modal identifier used at creation time.
   * @returns the associated modal data.
   */
  public getModalData(id: string): unknown {
    const modal = this.getModal(id);
    if (modal) {
      return modal.getData();
    }

    return null;
  }

  /**
   * Reset the data attached to a given modal.
   *
   * @param id The modal identifier used at creation time.
   * @returns the removed data or false if modal doesn't exist.
   */
  public resetModalData(id: string): unknown | boolean {
    if (this._modalStack.getModalStack().find((o: ModalInstance) => o.id === id)) {
      const removed: unknown = this.getModal(id).getData();
      this.getModal(id).removeData();
      return removed;
    } else {
      return false;
    }
  }

  /**
   * Close the latest opened modal
   */
  public closeLatestModal(): void {
    this.getTopOpenedModal().close();
  }

  /**
   * Create dynamic NgxTailwindModalComponent
   * @param id The modal identifier used at creation time
   * @param content The modal content (string, templateRef or Component)
   * @param options Any NgxTailwindModalComponent available options
   */
  public create<T>(id: string, content: Content<T>, options: INgxTailwindModalOptions = {}) {
    try {
      return this.getModal(id);
    } catch (e) {
      const ngContent = this._resolveNgContent(content);
      // Get an `EnvironmentInjector` instance from the `ApplicationRef`.
      const environmentInjector = this._appRef.injector;

      // We can now create a `ComponentRef` instance using Angular 19 API.
      const componentRef = createComponent(NgxTailwindModalComponent, {
        environmentInjector,
        projectableNodes: ngContent,
      });

      if (content instanceof Type) {
        console.log(content);
        componentRef.instance.contentComponent = content;
      }

      componentRef.instance.identifier = id;
      componentRef.instance.createFrom = 'service';

      if (typeof options.closable === 'boolean') {
        componentRef.instance.closable = options.closable;
      }
      if (typeof options.escapable === 'boolean') {
        componentRef.instance.escapable = options.escapable;
      }
      if (typeof options.dismissable === 'boolean') {
        componentRef.instance.dismissable = options.dismissable;
      }
      if (typeof options.customClass === 'string') {
        componentRef.instance.customClass = options.customClass;
      }
      if (typeof options.backdrop === 'boolean') {
        componentRef.instance.backdrop = options.backdrop;
      }
      if (typeof options.force === 'boolean') {
        componentRef.instance.force = options.force;
      }
      if (typeof options.hideDelay === 'number') {
        componentRef.instance.hideDelay = options.hideDelay;
      }
      if (typeof options.autostart === 'boolean') {
        componentRef.instance.autostart = options.autostart;
      }
      if (typeof options.target === 'string') {
        componentRef.instance.target = options.target;
      }
      if (typeof options.ariaLabel === 'string') {
        componentRef.instance.ariaLabel = options.ariaLabel;
      }
      if (typeof options.ariaLabelledBy === 'string') {
        componentRef.instance.ariaLabelledBy = options.ariaLabelledBy;
      }
      if (typeof options.ariaDescribedBy === 'string') {
        componentRef.instance.ariaDescribedBy = options.ariaDescribedBy;
      }
      if (typeof options.refocus === 'boolean') {
        componentRef.instance.refocus = options.refocus;
      }
      if (typeof options.displayMode === 'string') {
        componentRef.instance.displayMode = options.displayMode;
      }
      if (typeof options.sidebarPosition === 'string') {
        componentRef.instance.sidebarPosition = options.sidebarPosition;
      }
      if (typeof options.sidebarWidth === 'string') {
        componentRef.instance.sidebarWidth = options.sidebarWidth;
      }

      (componentRef.instance as unknown as NgxTailwindModalViewComponent).modalId = id;
      (componentRef.instance as unknown as NgxTailwindModalViewComponent).modalInstance = componentRef.instance;

      const domElem = (componentRef.hostView as EmbeddedViewRef<NgxTailwindModalComponent>).rootNodes[0] as HTMLElement;
      this._appRef.attachView(componentRef.hostView);
      this._document.body.appendChild(domElem);

      return componentRef.instance;
    }
  }

  private _addEvents(): boolean {
    if (!this.isBrowser) {
      return false;
    }

    window.addEventListener(NgxTailwindModalConfig.prefixEvent + 'create', ((e: CustomEvent) => {
      this._initModal(e.detail.instance);
    }) as EventListener);

    window.addEventListener(NgxTailwindModalConfig.prefixEvent + 'delete', ((e: CustomEvent) => {
      this._deleteModal(e.detail.instance);
    }) as EventListener);

    window.addEventListener(NgxTailwindModalConfig.prefixEvent + 'open', ((e: CustomEvent) => {
      this._openModal(e.detail.instance, e.detail.extraData.top);
    }) as EventListener);

    window.addEventListener(NgxTailwindModalConfig.prefixEvent + 'toggle', ((e: CustomEvent) => {
      this._toggleModal(e.detail.instance, e.detail.extraData.top);
    }) as EventListener);

    window.addEventListener(NgxTailwindModalConfig.prefixEvent + 'close', ((e: CustomEvent) => {
      this._closeModal(e.detail.instance);
    }) as EventListener);

    window.addEventListener(NgxTailwindModalConfig.prefixEvent + 'dismiss', ((e: CustomEvent) => {
      this._dismissModal(e.detail.instance);
    }) as EventListener);

    window.addEventListener('keyup', this._escapeKeyboardEvent);

    return true;
  }

  private _initModal(modalInstance: ModalInstance) {
    modalInstance.modal.layerPosition += this.getModalStackCount();
    this.addModal(modalInstance, modalInstance.modal.force);

    if (modalInstance.modal.autostart) {
      this.open(modalInstance.id);
    }
  }

  private _openModal(modalInstance: ModalInstance, top?: boolean): boolean {
    const modal = modalInstance.modal;

    if (modal.visible) {
      return false;
    }

    this.lastElementFocused = document.activeElement as HTMLElement;

    if (modal.escapable) {
      window.addEventListener('keyup', this._escapeKeyboardEvent);
    }

    if (modal.backdrop) {
      window.addEventListener('keydown', this._trapFocusModal);
    }

    if (top) {
      modal.layerPosition = this.getHigherIndex();
    }

    modal.addBodyClass();
    modal.overlayVisible = true;
    modal.visible = true;
    modal.onOpen.emit(modal);
    modal.markForCheck();

    setTimeout(() => {
      modal.openedClass = true;

      if (modal.target) {
        modal.targetPlacement();
      }

      modal.nsmDialog.first.nativeElement.setAttribute('role', 'dialog');
      modal.nsmDialog.first.nativeElement.setAttribute('tabIndex', '-1');
      modal.nsmDialog.first.nativeElement.setAttribute('aria-modal', 'true');
      modal.nsmDialog.first.nativeElement.focus();

      modal.markForCheck();
      modal.onOpenFinished.emit(modal);
    });

    return true;
  }

  private _toggleModal(modalInstance: ModalInstance, top?: boolean): boolean {
    const modal = modalInstance.modal;

    if (modal.visible) {
      return this._closeModal(modalInstance);
    } else {
      return this._openModal(modalInstance, top);
    }
  }

  private _closeModal(modalInstance: ModalInstance): boolean {
    const modal = modalInstance.modal;

    if (!modal.openedClass) {
      return false;
    }

    modal.openedClass = false;
    modal.onClose.emit(modal);
    modal.onAnyCloseEvent.emit(modal);

    if (this.getOpenedModals().length < 2) {
      modal.removeBodyClass();
      window.removeEventListener('keyup', this._escapeKeyboardEvent);
      window.removeEventListener('keydown', this._trapFocusModal);
    }

    setTimeout(() => {
      modal.visibleChange.emit(modal.visible);
      modal.visible = false;
      modal.overlayVisible = false;
      modal.nsmDialog.first.nativeElement.removeAttribute('tabIndex');
      modal.markForCheck();
      modal.onCloseFinished.emit(modal);
      modal.onAnyCloseEventFinished.emit(modal);
      if (modal.refocus && this.lastElementFocused) {
        this.lastElementFocused.focus();
      }

      this.removeModal(modalInstance.id);
    }, modal.hideDelay);

    return true;
  }

  private _dismissModal(modalInstance: ModalInstance): boolean {
    const modal = modalInstance.modal;
    if (!modal.openedClass) {
      return false;
    }

    modal.openedClass = false;
    modal.onDismiss.emit(modal);
    modal.onAnyCloseEvent.emit(modal);

    if (this.getOpenedModals().length < 2) {
      modal.removeBodyClass();
    }

    setTimeout(() => {
      modal.visible = false;
      modal.visibleChange.emit(modal.visible);
      modal.overlayVisible = false;
      modal.markForCheck();
      modal.onDismissFinished.emit(modal);
      modal.onAnyCloseEventFinished.emit(modal);
      this.removeModal(modalInstance.id);
    }, modal.hideDelay);

    return true;
  }

  private _deleteModal(modalInstance: ModalInstance) {
    this.removeModal(modalInstance.id);

    if (!this.getModalStack().length) {
      modalInstance.modal.removeBodyClass();
    }
  }

  /**
   * Resolve content according to the types
   * @param content The modal content (string, templateRef or Component)
   */
  private _resolveNgContent<T>(content: Content<T>): Node[][] {
    if (typeof content === 'string') {
      const element = this._document.createTextNode(content);
      return [[element]];
    }

    if (content instanceof TemplateRef) {
      const viewRef = content.createEmbeddedView({} as T);
      this._appRef.attachView(viewRef);
      return [viewRef.rootNodes];
    }

    return [];
  }

  /**
   * Close the latest opened modal if escape key event is emitted
   * @param event The Keyboard Event
   */
  private _escapeKeyboardEvent = (event: KeyboardEvent) => {
    if (event.key === 'Escape') {
      try {
        const modal = this.getTopOpenedModal();

        if (!modal.escapable) {
          return false;
        }

        modal.onEscape.emit(modal);
        this.closeLatestModal();

        return true;
      } catch (e) {
        return false;
      }
    }

    return false;
  };

  /**
   * Is current platform browser
   */
  private get isBrowser(): boolean {
    return isPlatformBrowser(this._platformId);
  }

  /**
   * While modal is open, the focus stay on it
   * @param event The Keyboar dEvent
   */
  private _trapFocusModal = (event: KeyboardEvent) => {
    if (event.key === 'Tab') {
      try {
        const modal = this.getTopOpenedModal();

        if (!modal.nsmDialog.first.nativeElement.contains(document.activeElement)) {
          event.preventDefault();
          event.stopPropagation();
          modal.nsmDialog.first.nativeElement.focus();
        }

        return true;
      } catch (e) {
        return false;
      }
    }

    return false;
  };

  /**
   * Remove dynamically created modal from DOM
   */
  private _destroyModal(modal: NgxTailwindModalComponent): void {
    // Prevent destruction of the inline modals
    if (modal.createFrom !== 'service') {
      return;
    }

    this._document.body.removeChild(modal.elementRef.nativeElement);
  }

  // Generic Modal Methods

  /**
   * Show a confirmation modal with customizable title, message, and buttons.
   * Returns a Promise that resolves with the user's choice.
   * 
   * @param data Configuration for the confirmation modal
   * @param options Optional modal configuration
   * @returns Promise that resolves to IConfirmationModalResult
   */
  public showConfirmation(
    data: IConfirmationModalData,
    options: INgxTailwindModalOptions = {}
  ): Promise<IConfirmationModalResult> {
    return new Promise((resolve) => {
      const modalId = `confirmation-modal-${Date.now()}`;
      const defaultOptions: INgxTailwindModalOptions = {
        dismissable: false,
        escapable: true,
        backdrop: true,
        ...options
      };

      const modal = this.create(modalId, ConfirmationModalComponent, defaultOptions);
      modal.setData(data);

      // Subscribe to modal close events to resolve the promise
      const closeSubscription = modal.onCloseFinished.subscribe(() => {
        const result = modal.getData() as IConfirmationModalResult;
        closeSubscription.unsubscribe();
        resolve(result || { confirmed: false });
      });

      const dismissSubscription = modal.onDismissFinished.subscribe(() => {
        const result: IConfirmationModalResult = { confirmed: false };
        dismissSubscription.unsubscribe();
        resolve(result);
      });

      modal.open();
    });
  }

  /**
   * Show an information modal with customizable title, message, and button.
   * Optionally supports auto-close timer.
   * 
   * @param data Configuration for the information modal
   * @param options Optional modal configuration
   * @returns Promise that resolves when modal is closed
   */
  public showInfo(
    data: IInfoModalData,
    options: INgxTailwindModalOptions = {}
  ): Promise<void> {
    return new Promise((resolve) => {
      const modalId = `info-modal-${Date.now()}`;
      const defaultOptions: INgxTailwindModalOptions = {
        dismissable: true,
        escapable: true,
        backdrop: true,
        ...options
      };

      const modal = this.create(modalId, InfoModalComponent, defaultOptions);
      modal.setData(data);

      // Subscribe to modal close events to resolve the promise
      const closeSubscription = modal.onCloseFinished.subscribe(() => {
        closeSubscription.unsubscribe();
        resolve();
      });

      const dismissSubscription = modal.onDismissFinished.subscribe(() => {
        dismissSubscription.unsubscribe();
        resolve();
      });

      modal.open();
    });
  }

  /**
   * Show an input modal for collecting user input with validation.
   * Returns a Promise that resolves with the input value or null if cancelled.
   * 
   * @param data Configuration for the input modal
   * @param options Optional modal configuration
   * @returns Promise that resolves to IInputModalResult
   */
  public showInput(
    data: IInputModalData,
    options: INgxTailwindModalOptions = {}
  ): Promise<IInputModalResult> {
    return new Promise((resolve) => {
      const modalId = `input-modal-${Date.now()}`;
      const defaultOptions: INgxTailwindModalOptions = {
        dismissable: false,
        escapable: true,
        backdrop: true,
        ...options
      };

      const modal = this.create(modalId, InputModalComponent, defaultOptions);
      modal.setData(data);

      // Subscribe to modal close events to resolve the promise
      const closeSubscription = modal.onCloseFinished.subscribe(() => {
        const result = modal.getData() as IInputModalResult;
        closeSubscription.unsubscribe();
        resolve(result || { value: null, cancelled: true });
      });

      const dismissSubscription = modal.onDismissFinished.subscribe(() => {
        const result: IInputModalResult = { value: null, cancelled: true };
        dismissSubscription.unsubscribe();
        resolve(result);
      });

      modal.open();
    });
  }

  // Sidebar Methods

  /**
   * Create dynamic NgxTailwindModalComponent in sidebar mode
   * @param id The modal identifier used at creation time
   * @param content The modal content (string, templateRef or Component)
   * @param options Any NgxTailwindModalComponent available options (will be extended with sidebar defaults)
   */
  public createSidebar<T>(
    id: string, 
    content: Content<T>, 
    options: Omit<INgxTailwindModalOptions, 'displayMode'> & { 
      position?: SidebarPosition;
      width?: string; 
    } = {}
  ) {
    const sidebarOptions: INgxTailwindModalOptions = {
      displayMode: 'sidebar',
      sidebarPosition: options.position || 'right',
      sidebarWidth: options.width || 'w-80',
      backdrop: false, // Sidebars typically don't need backdrop
      dismissable: true,
      escapable: true,
      ...options
    };

    return this.create(id, content, sidebarOptions);
  }

  /**
   * Show a confirmation modal in sidebar mode with customizable title, message, and buttons.
   * Returns a Promise that resolves with the user's choice.
   * 
   * @param data Configuration for the confirmation modal
   * @param options Optional sidebar configuration
   * @returns Promise that resolves to IConfirmationModalResult
   */
  public showSidebarConfirmation(
    data: IConfirmationModalData,
    options: { position?: SidebarPosition; width?: string } & Omit<INgxTailwindModalOptions, 'displayMode'> = {}
  ): Promise<IConfirmationModalResult> {
    return new Promise((resolve) => {
      const modalId = `confirmation-sidebar-${Date.now()}`;
      const sidebarOptions: INgxTailwindModalOptions = {
        displayMode: 'sidebar',
        sidebarPosition: options.position || 'right',
        sidebarWidth: options.width || 'w-80',
        dismissable: false,
        escapable: true,
        backdrop: false,
        ...options
      };

      const modal = this.create(modalId, ConfirmationModalComponent, sidebarOptions);
      modal.setData(data);

      // Subscribe to modal close events to resolve the promise
      const closeSubscription = modal.onCloseFinished.subscribe(() => {
        const result = modal.getData() as IConfirmationModalResult;
        closeSubscription.unsubscribe();
        resolve(result || { confirmed: false });
      });

      const dismissSubscription = modal.onDismissFinished.subscribe(() => {
        const result: IConfirmationModalResult = { confirmed: false };
        dismissSubscription.unsubscribe();
        resolve(result);
      });

      modal.open();
    });
  }

  /**
   * Show an information modal in sidebar mode with customizable title, message, and button.
   * Optionally supports auto-close timer.
   * 
   * @param data Configuration for the information modal
   * @param options Optional sidebar configuration
   * @returns Promise that resolves when modal is closed
   */
  public showSidebarInfo(
    data: IInfoModalData,
    options: { position?: SidebarPosition; width?: string } & Omit<INgxTailwindModalOptions, 'displayMode'> = {}
  ): Promise<void> {
    return new Promise((resolve) => {
      const modalId = `info-sidebar-${Date.now()}`;
      const sidebarOptions: INgxTailwindModalOptions = {
        displayMode: 'sidebar',
        sidebarPosition: options.position || 'right',
        sidebarWidth: options.width || 'w-80',
        dismissable: true,
        escapable: true,
        backdrop: false,
        ...options
      };

      const modal = this.create(modalId, InfoModalComponent, sidebarOptions);
      modal.setData(data);

      // Subscribe to modal close events to resolve the promise
      const closeSubscription = modal.onCloseFinished.subscribe(() => {
        closeSubscription.unsubscribe();
        resolve();
      });

      const dismissSubscription = modal.onDismissFinished.subscribe(() => {
        dismissSubscription.unsubscribe();
        resolve();
      });

      modal.open();
    });
  }

  /**
   * Show an input modal in sidebar mode for collecting user input with validation.
   * Returns a Promise that resolves with the input value or null if cancelled.
   * 
   * @param data Configuration for the input modal
   * @param options Optional sidebar configuration
   * @returns Promise that resolves to IInputModalResult
   */
  public showSidebarInput(
    data: IInputModalData,
    options: { position?: SidebarPosition; width?: string } & Omit<INgxTailwindModalOptions, 'displayMode'> = {}
  ): Promise<IInputModalResult> {
    return new Promise((resolve) => {
      const modalId = `input-sidebar-${Date.now()}`;
      const sidebarOptions: INgxTailwindModalOptions = {
        displayMode: 'sidebar',
        sidebarPosition: options.position || 'right',
        sidebarWidth: options.width || 'w-80',
        dismissable: false,
        escapable: true,
        backdrop: false,
        ...options
      };

      const modal = this.create(modalId, InputModalComponent, sidebarOptions);
      modal.setData(data);

      // Subscribe to modal close events to resolve the promise
      const closeSubscription = modal.onCloseFinished.subscribe(() => {
        const result = modal.getData() as IInputModalResult;
        closeSubscription.unsubscribe();
        resolve(result || { value: null, cancelled: true });
      });

      const dismissSubscription = modal.onDismissFinished.subscribe(() => {
        const result: IInputModalResult = { value: null, cancelled: true };
        dismissSubscription.unsubscribe();
        resolve(result);
      });

      modal.open();
    });
  }
}
