import { Component, OnDestroy, OnInit } from '@angular/core';
import { SlideshowState } from '../../state/slideshow.state';
import { Observable, Subject } from 'rxjs';
import { Slideshow } from '../../state/slideshow.model';
import { Select } from '@ngxs/store';
import { Dispatch } from '@ngxs-labs/dispatch-decorator';
import { SlideshowActions } from '../../state/slideshow.actions';
import { Navigate } from '@ngxs/router-plugin';
import { takeUntil } from 'rxjs/operators';

@Component({
  selector: 'solid-slideshow-slideshow-select',
  templateUrl: './slideshow-select.component.html',
  styleUrls: ['./slideshow-select.component.scss'],
})
export class SlideshowSelectComponent implements OnInit, OnDestroy {
  private $destroyed = new Subject();
  @Select(SlideshowState.getSlideshowOverview)
  public Slideshows!: Observable<Slideshow[]>;

  @Dispatch()
  private load() {
    return new SlideshowActions.Load();
  }

  @Dispatch()
  private openSlideshow(id: number) {
    return new Navigate([`${id}`]);
  }

  ngOnInit(): void {
    this.load();
    this.Slideshows.pipe(takeUntil(this.$destroyed)).subscribe((slideshows) => {
      if (slideshows.length === 1) {
        this.openSlideshow(slideshows[0].id);
      }
    });
  }

  ngOnDestroy(): void {
    this.$destroyed.next();
  }
}
