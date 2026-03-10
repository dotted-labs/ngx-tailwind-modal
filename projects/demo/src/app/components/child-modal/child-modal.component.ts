import { Component, inject, ViewContainerRef } from '@angular/core';
import { NgxTailwindModalService } from '@dotted-labs/ngx-tailwind-modal';

@Component({
  selector: 'app-child-modal',
  templateUrl: './child-modal.component.html',
})
export class ChildModalComponent {
  private readonly modalService = inject(NgxTailwindModalService);
  private readonly vcr = inject(ViewContainerRef);

  public openModal() {
    this.modalService.create(`modal-${Math.random()}`, ChildModalComponent, { dismissable: true }).open();
  }
}
