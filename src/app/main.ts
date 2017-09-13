import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';

import { enableProdMode } from '@angular/core';
import { getEnv } from '../environments/environments';
import { AppModule } from './app.module';

let env = getEnv();
if (env.production) {
  enableProdMode();
}

platformBrowserDynamic().bootstrapModule(AppModule);
