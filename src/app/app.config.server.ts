import { mergeApplicationConfig, ApplicationConfig } from '@angular/core';
import { provideServerRendering } from '@angular/platform-server'; // تصحيح اسم الوظيفة
import { appConfig } from './app.config';

const serverConfig: ApplicationConfig = {
  providers: [
    provideServerRendering() // تصحيح هنا
  ]
};

export const config = mergeApplicationConfig(appConfig, serverConfig);
