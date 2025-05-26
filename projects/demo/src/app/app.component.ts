import { CommonModule } from '@angular/common';
import { Component, inject, ViewContainerRef } from '@angular/core';
import { NgxTailwindModalService } from '@dotted-labs/ngx-tailwind-modal';
import { ChildModalComponent } from './components/child-modal/child-modal.component';

@Component({
  selector: 'app-root',
  imports: [CommonModule],
  templateUrl: './app.component.html',
})
export class AppComponent {
  private modalService = inject(NgxTailwindModalService);
  private vcr = inject(ViewContainerRef);

  public openModal() {
    this.modalService.create(`modal-${Math.random()}`, ChildModalComponent, { dismissable: true }).open();
  }
}
