# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is an Angular library project called `@dotted-labs/ngx-tailwind-modal`, built with Angular 19. It provides a modal component system using Tailwind CSS and DaisyUI styling. The repository contains both the library source and a demo application.

## Project Structure

- **Library**: `projects/ngx-tailwind-modal/` - Main library source code
- **Demo**: `projects/demo/` - Demonstration application showing library usage
- **Architecture**: Standalone components with provider pattern for Angular 19

### Key Components

- `NgxTailwindModalComponent` - Main modal component with HTML template
- `NgxTailwindModalViewComponent` - Base class for modal content with modal instance access
- `NgxTailwindModalService` - Core service managing modal lifecycle and stack
- `NgxTailwindModalStackService` - Modal stack management
- `ModalInstance` - Modal instance wrapper class

### Service Architecture

The library uses a centralized service pattern:
- **NgxTailwindModalService**: Primary API for creating/managing modals
- **NgxTailwindModalStackService**: Internal modal stack management
- **ModalInstance**: Wrapper containing modal ID and component instance
- **Event System**: Custom events for modal lifecycle management

## Development Commands

### Build Commands
```bash
# Build library for production
ng build --project @dotted-labs/ngx-tailwind-modal

# Build library in watch mode for development
ng build --project @dotted-labs/ngx-tailwind-modal --watch --configuration development

# Build demo application
ng build --project demo
```

### Development Server
```bash
# Start demo application (not configured in package.json)
ng serve demo

# Development with library rebuild
ng build --project @dotted-labs/ngx-tailwind-modal --watch --configuration development
```

### Testing
```bash
# Run tests
ng test

# Run tests for specific project
ng test @dotted-labs/ngx-tailwind-modal
```

### Linting
```bash
# Run linter
ng lint

# Run linter with auto-fix
ng lint --fix
```

## Technical Details

### Dependencies
- **Angular 19**: Core framework with standalone components
- **Tailwind CSS 4.x**: Utility-first CSS framework 
- **DaisyUI**: Component library for Tailwind CSS
- **RxJS**: Reactive programming support

### Modal System Architecture

1. **Modal Creation**: Via service `create()` method or HTML template
2. **Event System**: Custom browser events for modal communication
3. **Stack Management**: Z-index based modal layering
4. **Data Binding**: Bidirectional data flow between modal and content
5. **Lifecycle Management**: Full open/close/destroy lifecycle with events

### Key Features

- **Dynamic Component Creation**: Create modals programmatically with any Angular component
- **Data Passing**: Bidirectional data binding between modal and content components
- **Accessibility**: ARIA attributes and keyboard navigation support
- **Focus Management**: Proper focus trapping and restoration
- **Event System**: Comprehensive event emissions for all modal states

### Configuration

The library requires:
- Tailwind CSS configuration with DaisyUI
- Angular 19+ with standalone component support
- Provider configuration in app.config.ts using `provideNgxTailwindModal()`

## Common Patterns

### Creating Dynamic Modals
```typescript
this.modalService.create('modal-id', ComponentClass, viewContainerRef, options).open()
```

### Modal Content with Instance Access
Components extending `NgxTailwindModalViewComponent` get:
- `modalId`: String identifier
- `modalInstance`: Direct component reference

### Service API Usage
- `open(id)`, `close(id)`, `toggle(id)` - Basic controls
- `setModalData(data, id)`, `getModalData(id)` - Data management  
- `getModalStack()`, `getOpenedModals()` - Stack inspection

## Testing Setup

- **Karma + Jasmine**: Unit testing framework
- **Coverage**: HTML and LCOV reporting
- **Headless Chrome**: Test execution environment
- **Configuration**: `projects/ngx-tailwind-modal/karma.conf.js`