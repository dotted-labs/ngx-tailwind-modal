import { CommonModule } from '@angular/common';
import { Component, inject, ViewContainerRef } from '@angular/core';
import { NgxSmartModalService } from '../../../ngx-smart-modal/src/public-api';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './app.component.html',
})
export class AppComponent {
  private modalService = inject(NgxSmartModalService);
  private vcr = inject(ViewContainerRef);

  openModal() {
    this.modalService
      .create('modal-1', 'Contenido del modal 1<h1>Hola</h1>', this.vcr, {
        dismissable: true,
      })
      .open();
  }
}
