import { InjectionToken } from '@angular/core';
import * as MarkdownIt from 'markdown-it/lib';

export interface SolidCoreConfig {
  apiUrl: string;
  markdownPlugins?: ((md: MarkdownIt, ...params: any[]) => void)[]
}

export const SOLID_CORE_CONFIG = new InjectionToken<SolidCoreConfig>('solid-core-config');
