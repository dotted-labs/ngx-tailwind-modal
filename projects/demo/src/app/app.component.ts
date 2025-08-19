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

  public openModal() {
    this.modalService.create(`modal-${Math.random()}`, ChildModalComponent, { dismissable: true }).open();
  }

  public openSidebar(position: 'left' | 'right' = 'right') {
    this.modalService
      .createSidebar(`sidebar-${Math.random()}`, ChildModalComponent, {
        position,
        dismissable: true,
      })
      .open();
  }

  public openSidebarConfirmation() {
    this.modalService
      .showSidebarConfirmation(
        {
          title: 'Sidebar Confirmation',
          message: 'Do you want to proceed with this action?',
          confirmText: 'Yes, proceed',
          cancelText: 'Cancel',
        },
        { position: 'right' },
      )
      .then((result) => {
        console.log('Sidebar confirmation result:', result);
      });
  }

  public openSidebarInfo() {
    this.modalService
      .showSidebarInfo(
        {
          title: 'Sidebar Information',
          message: 'This is an information message displayed in a sidebar.',
          buttonText: 'Got it!',
        },
        { position: 'left' },
      )
      .then(() => {
        console.log('Sidebar info closed');
      });
  }

  public openModalConfirmation() {
    this.modalService
      .showConfirmation({
        title: 'Modal Confirmation',
        message: 'Do you want to proceed with this action?',
        confirmText: 'Yes, proceed',
        cancelText: 'Cancel',
      })
      .then((result) => {
        console.log('Modal confirmation result:', result);
      });
  }

  public openModalInfo() {
    this.modalService
      .showInfo({
        title: 'Modal Information',
        message: 'This is an information message displayed in a modal.',
        buttonText: 'Got it!',
      })
      .then(() => {
        console.log('Modal info closed');
      });
  }
}
