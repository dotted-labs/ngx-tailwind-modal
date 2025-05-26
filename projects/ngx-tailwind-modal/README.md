# NgxSmartModal

This library was generated with [Angular CLI](https://github.com/angular/angular-cli) version 14.2.0.

## Installation

```bash
npm install ngx-tailwind-modal --save
```

## Usage

### Using with standalone components (Angular 14+)

For Angular 14+ applications using standalone components, you can use the `provideNgxSmartModal` function:

```typescript
// In app.config.ts
import { ApplicationConfig } from '@angular/core';
import { provideNgxSmartModal } from '@dotted-labs/ngx-tailwind-modal';

export const appConfig: ApplicationConfig = {
  providers: [
    // ... other providers
    provideNgxSmartModal(),
  ],
};
```

### Using with NgModule (Legacy)

If you're still using NgModule, import the NgxSmartModalModule:

```typescript
import { NgxSmartModalModule } from '@dotted-labs/ngx-tailwind-modal';

@NgModule({
  imports: [
    // ...
    NgxSmartModalModule.forRoot(),
  ],
  // ...
})
export class AppModule {}
```

## Code scaffolding

Run `ng generate component component-name --project ngx-tailwind-modal` to generate a new component. You can also use `ng generate directive|pipe|service|class|guard|interface|enum|module --project ngx-tailwind-modal`.

> Note: Don't forget to add `--project ngx-tailwind-modal` or else it will be added to the default project in your `angular.json` file.

## Build

Run `ng build ngx-tailwind-modal` to build the project. The build artifacts will be stored in the `dist/` directory.

## Publishing

After building your library with `ng build ngx-tailwind-modal`, go to the dist folder `cd dist/ngx-tailwind-modal` and run `npm publish`.

## Running unit tests

Run `ng test ngx-tailwind-modal` to execute the unit tests via [Karma](https://karma-runner.github.io).

## Further help

To get more help on the Angular CLI use `ng help` or go check out the [Angular CLI Overview and Command Reference](https://angular.io/cli) page.
