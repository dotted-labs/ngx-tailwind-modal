import { EnvironmentProviders, makeEnvironmentProviders } from '@angular/core';
import { NgxTailwindModalStackService } from '../services/ngx-tailwind-modal-stack.service';
import { NgxTailwindModalService } from '../services/ngx-tailwind-modal.service';

/**
 * Provides the NgxTailwindModal services and components for standalone components/applications in Angular.
 *
 * This is the recommended way to include NgxTailwindModal in Angular applications.
 *
 * @example
 * ```typescript
 * // In your app.config.ts
 * import { provideNgxTailwindModal } from 'ngx-tailwind-modal';
 *
 * export const appConfig: ApplicationConfig = {
 *   providers: [
 *     // ... other providers
 *     provideNgxTailwindModal()
 *   ]
 * };
 * ```
 *
 * @returns Environment providers for NgxTailwindModal
 */
export function provideNgxTailwindModal(): EnvironmentProviders {
  return makeEnvironmentProviders([NgxTailwindModalService, NgxTailwindModalStackService]);
}
