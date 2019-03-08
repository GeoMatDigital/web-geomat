import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {InfoComponent} from './components/info/info.component';
import {PrivacyComponent} from './components/privacy/privacy.component';

const routes: Routes = [
  {path: 'info', component: InfoComponent, data: {title: 'Informationen'}},
  {path: 'privacy', component: PrivacyComponent, data: {title: 'Datenschutzerklärung'}},
  {path: 'gallery', loadChildren: './modules/gallery/gallery.module#GalleryModule'},
  {
    path: 'determination',
    loadChildren: './modules/determinationhelper/determinationhelper.module#DeterminationHelperModule',
  },
  {
    path: 'crystalsystem',
    loadChildren: './modules/crystalsystem/crystalsystem.module#CrystalsystemModule',
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
