# ngx-tailwind-modal

A lightweight and complete Angular library for managing modals with **Tailwind CSS** and **DaisyUI** styles.

## 🎨 Modern styling with Tailwind and DaisyUI

This library is designed for projects using **Tailwind CSS** and **DaisyUI**. Modals come pre-styled with DaisyUI components and you can use all available DaisyUI themes in your project.

## ✨ Features

- ⚡ **Angular 19** - Updated to the latest Angular version
- 🎨 **Tailwind CSS** - Modern utility-first styling
- 🌈 **DaisyUI** - Beautiful components and customizable themes
- 🔧 **Easy to use** - Simple and intuitive API
- 📱 **Responsive** - Works perfectly on all devices
- 🎭 **Themes** - Full support for all DaisyUI themes

## 🚀 Inspiration

This library is a fork from [ngx-smart-modal](https://github.com/maximelafarie/ngx-smart-modal), updated for Angular 19 and redesigned with Tailwind CSS and DaisyUI styles.

## 📦 Installation

```bash
npm install @dotted-labs/ngx-tailwind-modal
```

## 🛠️ Setup

### 1. Install required dependencies

```bash
npm install tailwindcss daisyui
```

### 2. Configure to use with DaisyUI

Add the following configuration to your `tailwind.config.js` file to ensure DaisyUI modal styles are included:

```javascript
/** @type {import('tailwindcss').Config} */
module.exports = {
  ...
  safelist: ['modal', 'modal-backdrop', 'modal-box'],
  ...
};
```

### 3. Configure the providers

In your `app.config.ts` (for standalone applications):

```typescript
import { ApplicationConfig } from '@angular/core';
import { provideNgxTailwindModal } from '@ngx-tailwind-modal';

export const appConfig: ApplicationConfig = {
  providers: [
    // ... other providers
    provideNgxTailwindModal(),
  ],
};
```

### 4. Import the component

Since this library uses standalone components, you need to import the component directly:

```typescript
import { Component } from '@angular/core';
import { NgxTailwindModalComponent } from '@ngx-tailwind-modal';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [NgxTailwindModalComponent],
  templateUrl: './app.component.html',
})
export class AppComponent {
  // ...
}
```

## 🎯 Basic Usage

### Create a modal component:

```typescript
import { Component } from '@angular/core';

@Component({
  selector: 'app-my-modal',
  standalone: true,
  template: `
    <div class="modal-box">
      <h3 class="font-bold text-lg">Hello!</h3>
      <p class="py-4">This is a modal with DaisyUI styles</p>
      <div class="modal-action">
        <button class="btn" (click)="closeModal()">Close</button>
      </div>
    </div>
  `,
})
export class MyModalComponent {
  closeModal() {
    // Modal will be closed automatically when component is destroyed
  }
}
```

### In your main component:

```typescript
import { Component, inject, ViewContainerRef } from '@angular/core';
import { NgxTailwindModalService } from '@ngx-tailwind-modal';
import { MyModalComponent } from './my-modal.component';

@Component({
  selector: 'app-root',
  standalone: true,
  template: ` <button class="btn btn-primary" (click)="openModal()">Open Modal</button> `,
})
export class AppComponent {
  private readonly modalService = inject(NgxTailwindModalService);
  private readonly vcr = inject(ViewContainerRef);

  public openModal() {
    this.modalService
      .create(`modal-${Math.random()}`, MyModalComponent, this.vcr, {
        dismissable: true,
      })
      .open();
  }
}
```

## 🎛️ Advanced Usage: Accessing Modal Instance

If you need to access the modal instance and ID from within your modal component, you can extend the `NgxTailwindModalViewComponent` class. This gives you access to `modalId` and `modalInstance` properties.

### Enhanced modal component:

```typescript
import { Component } from '@angular/core';
import { NgxTailwindModalViewComponent } from '@ngx-tailwind-modal';

@Component({
  selector: 'app-my-enhanced-modal',
  standalone: true,
  template: `
    <div class="modal-box">
      <h3 class="font-bold text-lg">Enhanced Modal</h3>
      <p class="py-4">Modal ID: {{ modalId }}</p>
      <p class="py-4">You can now control the modal from within the component!</p>
      <div class="modal-action">
        <button class="btn btn-secondary" (click)="closeModal()">Close</button>
        <button class="btn btn-primary" (click)="toggleModal()">Toggle</button>
      </div>
    </div>
  `,
})
export class MyEnhancedModalComponent extends NgxTailwindModalViewComponent {
  closeModal() {
    // Close the modal using the modal instance
    this.modalInstance.close();
  }

  toggleModal() {
    // Toggle the modal using the modal instance
    this.modalInstance.toggle();
  }

  // You can also access other modal methods like:
  // this.modalInstance.open()
  // this.modalInstance.setData(data)
  // this.modalInstance.getData()
}
```

### Benefits of extending NgxTailwindModalViewComponent:

- **Direct access** to the modal instance without injecting the service
- **Modal ID** available as a property for identification
- **Cleaner code** - no need to pass modal references manually
- **Type safety** - Full TypeScript support for modal operations

## 🔧 Service API

The `NgxTailwindModalService` provides several methods to manage your modals:

```typescript
// Open a modal
this.modalService.open('myModal');

// Close a modal
this.modalService.close('myModal');

// Toggle a modal
this.modalService.toggle('myModal');

// Close all modals
this.modalService.closeAll();

// Get a modal instance
const modal = this.modalService.getModal('myModal');

// Set data to a modal
this.modalService.setModalData({ key: 'value' }, 'myModal');

// Get data from a modal
const data = this.modalService.getModalData('myModal');

// Create a modal programmatically
this.modalService.create('dynamicModal', MyComponent, viewContainerRef);
```

## 📚 Demo

Check out the demo application in the `projects/demo` folder to see complete usage examples with different themes and styles.

```bash
npm run start:demo
```

## 🤝 Contributing

Contributions are welcome! Please open an issue or submit a pull request.

## 📄 License

MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- [ngx-smart-modal](https://github.com/maximelafarie/ngx-smart-modal) - Original library that served as inspiration
- [Tailwind CSS](https://tailwindcss.com/) - Utility-first CSS framework
- [DaisyUI](https://daisyui.com/) - Beautiful components for Tailwind CSS
