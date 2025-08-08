# @dotted-labs/ngx-tailwind-modal

[![npm version](https://badge.fury.io/js/@dotted-labs%2Fngx-tailwind-modal.svg)](https://badge.fury.io/js/@dotted-labs%2Fngx-tailwind-modal)
[![Angular](https://img.shields.io/badge/Angular-19-DD0031.svg)](https://angular.io)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0%2B-blue.svg)](https://www.typescriptlang.org)
[![MIT License](https://img.shields.io/badge/license-MIT-green.svg)](LICENSE)

A modern Angular 19 library for creating beautiful, accessible modals with **zero CSS setup required**. Built with **Tailwind CSS** and **DaisyUI** styling included - just focus on your content, we handle the modal infrastructure!

## 🌟 Key Features

- **🎯 Angular 19 Native** - Built with standalone components and modern Angular patterns
- **🎨 Zero Setup Styling** - No CSS required! Pre-styled with Tailwind CSS and DaisyUI
- **⚡ Dynamic Modal Creation** - Programmatically create modals with any Angular component
- **📊 Data Management** - Bidirectional data binding between modal and content
- **♿ Accessibility First** - ARIA attributes, focus management, and keyboard navigation
- **🔄 Event System** - Comprehensive lifecycle events for modal states
- **📱 Responsive Design** - Works seamlessly across all devices and screen sizes
- **🎭 Multiple Themes** - Full support for all DaisyUI themes and customization

## 🏗️ Architecture Overview

The library follows a service-centric architecture with these core concepts:

- **Service Pattern**: Centralized modal management through `NgxTailwindModalService`
- **Built-in Styling**: Complete modal styling provided - no additional CSS required
- **Stack Management**: Z-index based modal layering with proper focus handling
- **Event System**: Custom browser events for modal lifecycle communication
- **Instance Management**: Modal wrapper class for direct component control
- **Standalone Components**: Angular 19 compatible with tree-shaking support

## 📦 Installation & Setup

### 1. Install the library

```bash
npm install @dotted-labs/ngx-tailwind-modal
```

### 2. Install peer dependencies

```bash
npm install tailwindcss daisyui
```

### 3. Configure Tailwind CSS

Add the following to your `tailwind.config.js` to include the library's pre-built modal styles:

```javascript
/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{html,ts}",
    "./node_modules/@dotted-labs/ngx-tailwind-modal/**/*.{js,ts}"
  ],
  // These classes provide complete modal styling - no additional CSS needed
  safelist: ['modal', 'modal-backdrop', 'modal-box'], 
  plugins: [require('daisyui')]
};
```

### 4. Configure Angular providers

```typescript
// app.config.ts
import { ApplicationConfig } from '@angular/core';
import { provideNgxTailwindModal } from '@dotted-labs/ngx-tailwind-modal';

export const appConfig: ApplicationConfig = {
  providers: [
    // ... other providers
    provideNgxTailwindModal()
  ]
};
```

### 5. Import components

```typescript
import { Component } from '@angular/core';
import { NgxTailwindModalComponent } from '@dotted-labs/ngx-tailwind-modal';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [NgxTailwindModalComponent],
  templateUrl: './app.component.html'
})
export class AppComponent {}
```

## 🚀 Quick Start

> **💡 No CSS Required!** The library provides complete modal styling out of the box. Just focus on your content - we handle the modal backdrop, positioning, animations, and responsive design.

### Basic Modal Component

```typescript
import { Component } from '@angular/core';
import { NgxTailwindModalViewComponent } from '@dotted-labs/ngx-tailwind-modal';

@Component({
  selector: 'app-example-modal',
  standalone: true,
  template: `
    <!-- Only content styling needed - modal structure is automatic -->
    <div class="modal-box">
      <h3 class="font-bold text-lg">Welcome!</h3>
      <p class="py-4">Focus on your content - the modal backdrop, positioning, and animations are handled automatically!</p>
      <div class="modal-action">
        <button class="btn btn-ghost" (click)="closeModal()">Cancel</button>
        <button class="btn btn-primary" (click)="confirmAction()">Confirm</button>
      </div>
    </div>
  `
})
export class ExampleModalComponent extends NgxTailwindModalViewComponent {
  closeModal() {
    this.modalInstance.close();
  }
  
  confirmAction() {
    // Perform action then close
    console.log('Action confirmed!');
    this.modalInstance.close();
  }
}
```

### Opening Modals Programmatically

```typescript
import { Component, inject, ViewContainerRef } from '@angular/core';
import { NgxTailwindModalService } from '@dotted-labs/ngx-tailwind-modal';
import { ExampleModalComponent } from './example-modal.component';

@Component({
  selector: 'app-demo',
  standalone: true,
  template: `
    <div class="space-y-4 p-8">
      <button class="btn btn-primary" (click)="openSimpleModal()">
        Open Simple Modal
      </button>
      
      <button class="btn btn-secondary" (click)="openModalWithData()">
        Open Modal with Data
      </button>
    </div>
  `
})
export class DemoComponent {
  private readonly modalService = inject(NgxTailwindModalService);
  private readonly vcr = inject(ViewContainerRef);

  openSimpleModal() {
    this.modalService
      .create('example-modal', ExampleModalComponent, this.vcr, {
        dismissable: true,
        escapable: true
      })
      .open();
  }
  
  openModalWithData() {
    this.modalService
      .create('data-modal', ExampleModalComponent, this.vcr)
      .setData({ message: 'Hello from parent!', timestamp: Date.now() })
      .open();
  }
}
```

## 🔧 Core API Reference

### NgxTailwindModalService

The primary service for managing modals throughout your application.

#### Modal Creation & Management

```typescript
// Create and immediately open a modal
this.modalService.create('modal-id', ComponentClass, viewContainerRef, options).open();

// Basic modal operations
this.modalService.open('modal-id');          // Open modal
this.modalService.close('modal-id');         // Close modal  
this.modalService.toggle('modal-id');        // Toggle modal state
this.modalService.closeAll();                // Close all open modals

// Data management
this.modalService.setModalData(data, 'modal-id');  // Pass data to modal
const data = this.modalService.getModalData('modal-id');  // Get modal data
this.modalService.resetModalData('modal-id'); // Clear modal data

// Modal inspection
const modal = this.modalService.getModal('modal-id');     // Get modal instance
const stack = this.modalService.getModalStack();          // Get all modals
const opened = this.modalService.getOpenedModals();       // Get open modals
const topModal = this.modalService.getTopOpenedModal();   // Get top modal
```

#### Configuration Options

```typescript
interface INgxTailwindModalOptions {
  closable?: boolean;         // Show close button (default: true)
  escapable?: boolean;        // Close on Escape key (default: true)
  dismissable?: boolean;      // Close on backdrop click (default: true)
  customClass?: string;       // Additional CSS classes
  backdrop?: boolean;         // Show backdrop (default: true)
  force?: boolean;            // Override existing modal (default: true)
  hideDelay?: number;         // Close animation delay (default: 500)
  autostart?: boolean;        // Auto-open on creation (default: false)
  target?: string;            // Position relative to element
  ariaLabel?: string;         // ARIA accessibility label
  ariaLabelledBy?: string;    // ARIA labelledby reference
  ariaDescribedBy?: string;   // ARIA describedby reference
  refocus?: boolean;          // Return focus after close (default: true)
}
```

### NgxTailwindModalViewComponent

Extend this class in your modal content components for direct modal access:

```typescript
export class YourModalComponent extends NgxTailwindModalViewComponent {
  ngOnInit() {
    console.log('Modal ID:', this.modalId);
    console.log('Modal data:', this.modalInstance.getData());
  }
  
  closeWithResult(result: any) {
    this.modalInstance.setData(result);
    this.modalInstance.close();
  }
}
```

**Available Properties:**
- `modalId: string` - Unique modal identifier
- `modalInstance: NgxTailwindModalComponent` - Direct modal control

### Event System

Listen to modal lifecycle events:

```typescript
// Component-level events
modal.onOpen.subscribe(() => console.log('Modal opened'));
modal.onClose.subscribe(() => console.log('Modal closed'));
modal.onDataAdded.subscribe(data => console.log('Data added:', data));

// Global browser events
document.addEventListener('ngx-tailwind-modal.open', (e) => {
  console.log('Modal opened:', e.detail);
});
```

**Available Events:**
- `onOpen` / `onOpenFinished` - Modal opening lifecycle
- `onClose` / `onCloseFinished` - Modal closing lifecycle  
- `onDismiss` / `onDismissFinished` - Modal dismissal (backdrop/escape)
- `onDataAdded` / `onDataRemoved` - Data management events
- `onEscape` - Escape key pressed

## 📋 Usage Patterns

### Template Declaration

> **🎨 Styling Made Easy:** The library automatically provides modal backdrop, positioning, z-index management, and animations. You only need to style your content inside `modal-box`.

Declare modals directly in your templates:

```html
<!-- The library handles all modal infrastructure automatically -->
<ngx-tailwind-modal 
  identifier="settings-modal"
  [closable]="true"
  [dismissable]="true"
  [escapable]="true">
  
  <!-- Only style your content - backdrop and positioning are automatic -->
  <div class="modal-box max-w-2xl">
    <h3 class="font-bold text-lg mb-4">Application Settings</h3>
    
    <!-- Settings form content -->
    <form class="space-y-4">
      <div class="form-control">
        <label class="label">
          <span class="label-text">Theme</span>
        </label>
        <select class="select select-bordered">
          <option>Light</option>
          <option>Dark</option>
          <option>Auto</option>
        </select>
      </div>
    </form>
    
    <div class="modal-action">
      <button class="btn" (click)="closeModal()">Cancel</button>
      <button class="btn btn-primary" (click)="saveSettings()">Save Changes</button>
    </div>
  </div>
</ngx-tailwind-modal>

<!-- Open the modal using the service -->
<button class="btn btn-outline" (click)="openSettings()">
  Open Settings
</button>
```

### Data Communication

```typescript
// Parent component passing data
export class ParentComponent {
  openUserModal(user: User) {
    this.modalService
      .create('user-modal', UserModalComponent, this.vcr)
      .setData({ user, mode: 'edit' })
      .open();
  }
}

// Modal component receiving data
export class UserModalComponent extends NgxTailwindModalViewComponent implements OnInit {
  user!: User;
  mode!: 'view' | 'edit';
  
  ngOnInit() {
    const data = this.modalInstance.getData() as { user: User, mode: string };
    this.user = data.user;
    this.mode = data.mode as 'view' | 'edit';
  }
  
  saveUser() {
    // Update user data
    this.modalInstance.setData({ user: this.user, result: 'saved' });
    this.modalInstance.close();
  }
}
```

### Modal Stacking

```typescript
// Open multiple modals in sequence
openConfirmationFlow() {
  // First modal
  const userModal = this.modalService.create('user-form', UserFormComponent, this.vcr);
  
  userModal.onClose.subscribe(() => {
    // Open confirmation modal on top
    this.modalService
      .create('confirm-save', ConfirmationComponent, this.vcr, {
        backdrop: false  // Don't block the previous modal
      })
      .open();
  });
  
  userModal.open();
}
```

### Responsive Modal Sizes

> **📱 Built-in Responsive Design:** The library automatically handles responsive positioning and sizing. You only need to specify content dimensions.

```typescript
// The library handles modal positioning - you only style content dimensions
@Component({
  template: `
    <!-- Library provides responsive modal backdrop and positioning -->
    <div class="modal-box w-11/12 max-w-5xl lg:max-w-3xl md:max-w-2xl sm:max-w-sm">
      <!-- Focus only on your content layout -->
      <h3 class="font-bold text-lg">Responsive Content</h3>
      <p>The modal backdrop, positioning, and z-index are handled automatically!</p>
    </div>
  `
})
export class ResponsiveModalComponent {}
```

## ♿ Accessibility Features

- **ARIA Support**: Full ARIA attributes for screen readers
- **Focus Management**: Automatic focus trapping and restoration
- **Keyboard Navigation**: Escape key, Tab navigation support
- **Semantic HTML**: Proper role assignments and structure
- **Screen Reader Compatible**: Optimized announcements and descriptions

```typescript
// Example with accessibility options
this.modalService.create('accessible-modal', ContentComponent, this.vcr, {
  ariaLabel: 'User profile settings dialog',
  ariaLabelledBy: 'modal-title',
  ariaDescribedBy: 'modal-description',
  refocus: true  // Return focus to trigger element
});
```

## 🎨 Theming & Customization

> **🎭 No CSS Setup Required:** The library automatically applies DaisyUI modal styling including backdrop, animations, and responsive behavior. You only customize the content inside `modal-box`.

### DaisyUI Themes

All DaisyUI themes work automatically without additional setup:

```html
<!-- Apply theme at document level - modal backdrop styles automatically -->
<html data-theme="dark">

<!-- Or apply theme to specific modal content -->
<div data-theme="cyberpunk" class="modal-box">
  <!-- Only content needs theme styling - modal structure is automatic -->
  <h3 class="font-bold text-lg">Cyberpunk Modal</h3>
  <p>Backdrop and positioning are handled by the library!</p>
</div>
```

### Custom Content Styling

> **Focus on Content:** The library manages all modal infrastructure. Customize only your content styling.

```typescript
// Add custom classes to your modal content
this.modalService.create('styled-modal', Component, this.vcr, {
  customClass: 'custom-content-styles'
});
```

```css
/* Style only your modal content - library handles the rest */
.custom-content-styles .modal-box {
  @apply bg-gradient-to-r from-purple-500 to-pink-500;
  @apply text-white shadow-xl;
  /* No need to style backdrop, positioning, or z-index */
}
```

## 🧪 Development & Testing

### Development Commands

```bash
# Build library for production
ng build @dotted-labs/ngx-tailwind-modal

# Build library in watch mode
ng build @dotted-labs/ngx-tailwind-modal --watch --configuration development

# Run tests
ng test @dotted-labs/ngx-tailwind-modal

# Run linting
ng lint @dotted-labs/ngx-tailwind-modal

# Start demo application
ng serve demo
```

### Testing Integration

```typescript
// Test modal service in your unit tests
import { TestBed } from '@angular/core/testing';
import { NgxTailwindModalService } from '@dotted-labs/ngx-tailwind-modal';

describe('Modal Integration', () => {
  let modalService: NgxTailwindModalService;
  
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [NgxTailwindModalService]
    });
    modalService = TestBed.inject(NgxTailwindModalService);
  });
  
  it('should create and open modal', () => {
    const modal = modalService.create('test-modal', TestComponent, vcr);
    modal.open();
    expect(modal.isVisible()).toBe(true);
  });
});
```

## 📦 Library Structure

```
projects/ngx-tailwind-modal/
├── src/
│   ├── lib/
│   │   ├── components/
│   │   │   ├── ngx-tailwind-modal.component.ts
│   │   │   └── ngx-tailwind-modal-view.component.ts
│   │   ├── services/
│   │   │   ├── ngx-tailwind-modal.service.ts
│   │   │   └── ngx-tailwind-modal-stack.service.ts
│   │   ├── interfaces/
│   │   │   └── ngx-tailwind-modal.interface.ts
│   │   ├── classes/
│   │   │   └── modal-instance.ts
│   │   └── providers/
│   │       └── ngx-tailwind-modal.provider.ts
│   └── public-api.ts
projects/demo/           # Demo application
```

## 🔗 Dependencies

> **Minimal Setup:** Only Tailwind CSS and DaisyUI are required - no additional modal CSS frameworks needed!

- **Angular**: 19.0.0+
- **TypeScript**: 5.0+
- **Tailwind CSS**: 4.0+ (provides utility classes)
- **DaisyUI**: 5.0+ (provides complete modal styling)
- **RxJS**: 7.8+

**What's Included:** Complete modal system with backdrop, animations, positioning, focus management, and responsive design.

## 🚀 Demo & Examples

Explore the comprehensive demo application:

```bash
# Clone the repository
git clone https://github.com/dotted-labs/ngx-tailwind-modal.git
cd ngx-tailwind-modal

# Install dependencies
npm install

# Start demo application
ng serve demo
```

Visit `http://localhost:4200` to see live examples with:
- Multiple modal types and configurations (no CSS required!)
- Theme switching demonstrations
- Accessibility features showcase
- Advanced usage patterns with zero modal styling setup

## 🤝 Contributing

We welcome contributions! Please see our [Contributing Guide](CONTRIBUTING.md) for details.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- **[ngx-smart-modal](https://github.com/maximelafarie/ngx-smart-modal)** - Original inspiration and architecture patterns
- **[Tailwind CSS](https://tailwindcss.com/)** - Modern utility-first CSS framework
- **[DaisyUI](https://daisyui.com/)** - Beautiful component library for Tailwind
- **[Angular Team](https://angular.io/)** - Fantastic framework and standalone component architecture

---

<p align="center">
  <a href="https://github.com/dotted-labs/ngx-tailwind-modal">⭐ Star this repository</a> if it helped you!
</p>
