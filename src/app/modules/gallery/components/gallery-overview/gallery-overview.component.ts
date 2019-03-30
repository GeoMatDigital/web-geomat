import {Component} from '@angular/core';
import {MatDialog} from '@angular/material';
import {select, Store} from '@ngrx/store';
import {BaseComponent} from '../../../../shared/abstract/base.component';
import {GalleryService} from '../../services/gallery.service';
import {GalleryAppState, PhotographModel} from '../../state/gallery.model';
import {selectPhotographs} from '../../state/selectors';
import {PhotographDetailModalComponent} from '../photograph-detail-modal/photograph-detail-modal.component';

@Component({
  selector: 'gallery-gallery-overview',
  templateUrl: './gallery-overview.component.html',
  styleUrls: ['./gallery-overview.component.scss'],
})
export class GalleryOverviewComponent extends BaseComponent {
  public Entries: PhotographModel[] = [];
  public EntriesLoaded: boolean[] = [];

  constructor(
    service: GalleryService,
    store: Store<GalleryAppState>,
    private _dialog: MatDialog,
  ) {
    super();
    service.loadGallery();
    this.addSub(store.pipe(select(selectPhotographs)).subscribe(photographs => {
      this.Entries = photographs;
      this.EntriesLoaded = photographs.map(() => false);
    }));
  }

  imageLoaded(e: Event, index: number) {
    this.EntriesLoaded[index] = true;
  }

  public onCardClick(entry: PhotographModel) {
    PhotographDetailModalComponent.CreateModal(this._dialog, entry.id);
  }
}
