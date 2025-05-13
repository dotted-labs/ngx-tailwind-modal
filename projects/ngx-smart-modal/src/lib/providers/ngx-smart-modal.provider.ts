import { EnvironmentProviders, makeEnvironmentProviders } from '@angular/core';
import { NgxSmartModalService } from '../services/ngx-smart-modal.service';
import { NgxSmartModalStackService } from '../services/ngx-smart-modal-stack.service';

/**
 * Provides the NgxSmartModal services for standalone components/applications in Angular.
 *
 * This is the recommended way to include NgxSmartModal in Angular applications.
 *
 * @example
 * ```typescript
 * // In your app.config.ts
 * import { provideNgxSmartModal } from 'ngx-smart-modal';
 *
 * export const appConfig: ApplicationConfig = {
 *   providers: [
 *     // ... other providers
 *     provideNgxSmartModal()
 *   ]
 * };
 * ```
 *
 * @returns Environment providers for NgxSmartModal
 */
export function provideNgxSmartModal(): EnvironmentProviders {
  return makeEnvironmentProviders([
    NgxSmartModalService,
    NgxSmartModalStackService,
  ]);
}
