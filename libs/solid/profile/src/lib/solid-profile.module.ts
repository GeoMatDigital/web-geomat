import { InjectionToken, NgModule } from '@angular/core';
import { TreeComponent } from './components/tree/tree.component';
import { ListComponent } from './components/list/list.component';
import { DetailComponent } from './components/detail/detail.component';
import { BaseComponent } from './components/base/base.component';
import { GridComponent } from './components/grid/grid.component';
import { SolidCoreConfig, SolidCoreModule } from '@zentrumnawi/solid-core';
import { MatTabsModule } from '@angular/material/tabs';
import { SolidProfileRoutingModule } from './solid-profile-routing.module';
import { NgxsModule } from '@ngxs/store';
import { ProfileState } from './state/profile.state';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule, MatIconRegistry } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatListModule } from '@angular/material/list';
import { MatTreeModule } from '@angular/material/tree';
import { DomSanitizer } from '@angular/platform-browser';
import { SelectedDirective } from './components/selected.directive';
import { ProfileDefinitionService } from './services/profile-definition.service';
import { MatExpansionModule } from '@angular/material/expansion';
import { ProfileTitlePipe } from './profile-title.pipe';

// This workaround is required for the "old" angular compiler in production mode. Ivy library publishing is not supported until angular 10.
// https://github.com/ng-packagr/ng-packagr/issues/767
export const ngxsFeatureModule = NgxsModule.forFeature([ProfileState]);

@NgModule({
  declarations: [
    TreeComponent,
    ListComponent,
    DetailComponent,
    BaseComponent,
    GridComponent,
    SelectedDirective,
    ProfileTitlePipe,
  ],
  imports: [
    SolidCoreModule,
    MatTabsModule,
    SolidCoreModule,
    SolidProfileRoutingModule,
    ngxsFeatureModule,
    MatButtonModule,
    MatExpansionModule,
    MatFormFieldModule,
    MatIconModule,
    MatInputModule,
    MatListModule,
    MatProgressSpinnerModule,
    MatToolbarModule,
    MatTreeModule,
  ],
  providers: [ProfileDefinitionService],
})
export class SolidProfileModule {
  constructor(registry: MatIconRegistry, url: DomSanitizer) {
    const addIcon = (name: string) =>
      registry.addSvgIcon(
        name,
        url.bypassSecurityTrustResourceUrl(`assets/svg/${name}.svg`)
      );
    addIcon('search');
  }
}
