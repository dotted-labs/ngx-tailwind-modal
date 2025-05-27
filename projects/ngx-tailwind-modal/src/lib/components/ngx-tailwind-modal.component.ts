import { CommonModule, DOCUMENT, isPlatformBrowser } from '@angular/common';
import {
  AfterViewChecked,
  ChangeDetectorRef,
  Component,
  ComponentRef,
  ElementRef,
  EventEmitter,
  HostListener,
  Inject,
  Input,
  OnDestroy,
  OnInit,
  Output,
  PLATFORM_ID,
  QueryList,
  Renderer2,
  Type,
  ViewChild,
  ViewChildren,
  ViewContainerRef,
} from '@angular/core';
import { NgxTailwindModalConfig } from '../config/ngx-tailwind-modal.config';

@Component({
  selector: 'ngx-tailwind-modal',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './ngx-tailwind-modal.component.html',
  styles: [],
})
export class NgxTailwindModalComponent implements OnInit, OnDestroy, AfterViewChecked {
  @Input() public closable = true;
  @Input() public escapable = true;
  @Input() public dismissable = true;
  @Input() public identifier = '';
  @Input() public customClass = 'nsm-dialog-animation-fade';
  @Input() public visible = false;
  @Input() public backdrop = true;
  @Input() public force = true;
  @Input() public hideDelay = 500;
  @Input() public autostart = false;
  @Input() public target = '';
  @Input() public ariaLabel: string | null = null;
  @Input() public ariaLabelledBy: string | null = null;
  @Input() public ariaDescribedBy: string | null = null;
  @Input() public refocus = true;

  @Output() public visibleChange: EventEmitter<boolean> = new EventEmitter<boolean>();
  @Output() public onClose: EventEmitter<any> = new EventEmitter();
  @Output() public onCloseFinished: EventEmitter<any> = new EventEmitter();
  @Output() public onDismiss: EventEmitter<any> = new EventEmitter();
  @Output() public onDismissFinished: EventEmitter<any> = new EventEmitter();
  @Output() public onAnyCloseEvent: EventEmitter<any> = new EventEmitter();
  @Output() public onAnyCloseEventFinished: EventEmitter<any> = new EventEmitter();
  @Output() public onOpen: EventEmitter<any> = new EventEmitter();
  @Output() public onOpenFinished: EventEmitter<any> = new EventEmitter();
  @Output() public onEscape: EventEmitter<any> = new EventEmitter();
  @Output() public onDataAdded: EventEmitter<any> = new EventEmitter();
  @Output() public onDataRemoved: EventEmitter<any> = new EventEmitter();

  public contentComponent!: Type<any>;
  public layerPosition = 1041;
  public overlayVisible = false;
  public openedClass = false;

  public createFrom = 'html';

  private _data: any;
  private _componentRef!: ComponentRef<Component>;

  @ViewChildren('nsmContent') private nsmContent!: QueryList<ElementRef>;
  @ViewChildren('nsmDialog') public nsmDialog!: QueryList<ElementRef>;
  @ViewChildren('nsmOverlay') private nsmOverlay!: QueryList<ElementRef>;
  @ViewChild('dynamicContent', { read: ViewContainerRef })
  private dynamicContentContainer!: ViewContainerRef;

  constructor(
    private _renderer: Renderer2,
    private _changeDetectorRef: ChangeDetectorRef,
    private _viewContainerRef: ViewContainerRef,
    public readonly elementRef: ElementRef,
    @Inject(DOCUMENT) private _document: Document,
    @Inject(PLATFORM_ID) private _platformId: object,
  ) {}

  public ngOnInit() {
    if (!this.identifier || !this.identifier.length) {
      throw new Error('identifier field isn’t set. Please set one before calling <ngx-smart-modal> in a template.');
    }

    this._sendEvent('create');
  }

  public ngAfterViewChecked() {
    if (this.overlayVisible && this.contentComponent && this.dynamicContentContainer && this.dynamicContentContainer.length === 0) {
      this.createDynamicContent();
    }
  }

  public ngOnDestroy() {
    console.log('ngOnDestroy');
    this._sendEvent('delete');
  }

  /**
   * Open the modal instance
   *
   * @param top open the modal top of all other
   * @returns the modal component
   */
  public open(top?: boolean): NgxTailwindModalComponent {
    this._sendEvent('open', { top: top });

    return this;
  }

  /**
   * Close the modal instance
   *
   * @returns the modal component
   */
  public close(): NgxTailwindModalComponent {
    this._sendEvent('close');

    return this;
  }

  /**
   * Dismiss the modal instance
   *
   * @param e the event sent by the browser
   * @returns the modal component
   */
  public dismiss(e: MouseEvent): NgxTailwindModalComponent {
    console.log('dismiss', e);

    this._sendEvent('dismiss');

    return this;
  }

  /**
   * Toggle visibility of the modal instance
   *
   * @param top open the modal top of all other
   * @returns the modal component
   */
  public toggle(top?: boolean): NgxTailwindModalComponent {
    this._sendEvent('toggle', { top: top });

    return this;
  }

  /**
   * Add a custom class to the modal instance
   *
   * @param className the class to add
   * @returns the modal component
   */
  public addCustomClass(className: string): NgxTailwindModalComponent {
    if (!this.customClass.length) {
      this.customClass = className;
    } else {
      this.customClass += ' ' + className;
    }

    return this;
  }

  /**
   * Remove a custom class to the modal instance
   *
   * @param className the class to remove
   * @returns the modal component
   */
  public removeCustomClass(className?: string): NgxTailwindModalComponent {
    if (className) {
      this.customClass = this.customClass.replace(className, '').trim();
    } else {
      this.customClass = '';
    }

    return this;
  }

  /**
   * Returns the visibility state of the modal instance
   */
  public isVisible(): boolean {
    return this.visible;
  }

  /**
   * Checks if data is attached to the modal instance
   */
  public hasData(): boolean {
    return this._data !== undefined;
  }

  /**
   * Attach data to the modal instance
   *
   * @param data the data to attach
   * @param force override potentially attached data
   * @returns the modal component
   */
  public setData(data: unknown, force?: boolean): NgxTailwindModalComponent {
    if (!this.hasData() || (this.hasData() && force)) {
      this._data = data;
      this.assignModalDataToComponentData(this._componentRef);
      this.onDataAdded.emit(this._data);
      this.markForCheck();
    }

    return this;
  }

  /**
   * Retrieve the data attached to the modal instance
   */
  public getData(): unknown {
    this.assignComponentDataToModalData(this._componentRef);
    return this._data;
  }

  /**
   * Remove the data attached to the modal instance
   *
   * @returns the modal component
   */
  public removeData(): NgxTailwindModalComponent {
    this._data = undefined;
    this.onDataRemoved.emit(true);
    this.markForCheck();

    return this;
  }

  /**
   * Add body class modal opened
   *
   * @returns the modal component
   */
  public addBodyClass(): NgxTailwindModalComponent {
    this._renderer.addClass(this._document.body, NgxTailwindModalConfig.bodyClassOpen);

    return this;
  }

  /**
   * Add body class modal opened
   *
   * @returns the modal component
   */
  public removeBodyClass(): NgxTailwindModalComponent {
    this._renderer.removeClass(this._document.body, NgxTailwindModalConfig.bodyClassOpen);

    return this;
  }

  public markForCheck() {
    try {
      this._changeDetectorRef.detectChanges();
    } catch (e) {
      /* empty */
    }

    this._changeDetectorRef.markForCheck();
  }

  /**
   * Listens for window resize event and recalculates modal instance position if it is element-relative
   */
  @HostListener('window:resize')
  public targetPlacement(): boolean | void {
    if (!this.isBrowser || !this.nsmDialog.length || !this.nsmContent.length || !this.nsmOverlay.length || !this.target) {
      return false;
    }
    const targetElement = this._document.querySelector(this.target);

    if (!targetElement) {
      return false;
    }

    const targetElementRect = targetElement.getBoundingClientRect();
    const bodyRect = this.nsmOverlay.first.nativeElement.getBoundingClientRect();

    const nsmContentRect = this.nsmContent.first.nativeElement.getBoundingClientRect();
    const nsmDialogRect = this.nsmDialog.first.nativeElement.getBoundingClientRect();

    const marginLeft = parseInt(getComputedStyle(this.nsmContent.first.nativeElement).marginLeft, 10);
    const marginTop = parseInt(getComputedStyle(this.nsmContent.first.nativeElement).marginTop, 10);

    let offsetTop = targetElementRect.top - nsmDialogRect.top - (nsmContentRect.height - targetElementRect.height) / 2;
    let offsetLeft = targetElementRect.left - nsmDialogRect.left - (nsmContentRect.width - targetElementRect.width) / 2;

    if (offsetLeft + nsmDialogRect.left + nsmContentRect.width + marginLeft * 2 > bodyRect.width) {
      offsetLeft = bodyRect.width - (nsmDialogRect.left + nsmContentRect.width) - marginLeft * 2;
    } else if (offsetLeft + nsmDialogRect.left < 0) {
      offsetLeft = -nsmDialogRect.left;
    }

    if (offsetTop + nsmDialogRect.top + nsmContentRect.height + marginTop > bodyRect.height) {
      offsetTop = bodyRect.height - (nsmDialogRect.top + nsmContentRect.height) - marginTop;
    }

    this._renderer.setStyle(this.nsmContent.first.nativeElement, 'top', (offsetTop < 0 ? 0 : offsetTop) + 'px');
    this._renderer.setStyle(this.nsmContent.first.nativeElement, 'left', offsetLeft + 'px');
  }

  private _sendEvent(name: string, extraData?: unknown): boolean {
    if (!this.isBrowser) {
      return false;
    }

    const data = {
      extraData: extraData,
      instance: { id: this.identifier, modal: this },
    };

    const event = new CustomEvent(NgxTailwindModalConfig.prefixEvent + name, {
      detail: data,
    });

    return window.dispatchEvent(event);
  }

  /**
   * Is current platform browser
   */
  private get isBrowser(): boolean {
    return isPlatformBrowser(this._platformId);
  }

  /**
   * Creates content inside provided ViewContainerRef
   */
  private createDynamicContent(): void {
    this.dynamicContentContainer.clear();
    this._componentRef = this.dynamicContentContainer.createComponent(this.contentComponent);
    this.assignModalDataToComponentData(this._componentRef);
    this.markForCheck();
  }

  /**
   * Assigns the modal data to the ComponentRef instance properties
   */
  private assignModalDataToComponentData(componentRef: ComponentRef<Component>): void {
    if (componentRef) {
      Object.assign(componentRef.instance, { id: this.identifier, modalInstance: this, ...this._data });
    }
  }

  /**
   * Assigns the ComponentRef instance properties to the modal data object
   */
  private assignComponentDataToModalData(componentRef: ComponentRef<Component>): void {
    if (componentRef) {
      Object.assign(this._data, componentRef.instance);
    }
  }
}
