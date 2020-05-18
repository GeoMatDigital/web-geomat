import { Action, Selector, State, StateContext } from '@ngxs/store';
import { determinationhelper } from './determination-helper.pages';
import { Slideshow } from './slideshow.model';
import { HttpClient } from '@angular/common/http';
import { SlideshowLoadContentAction } from './slideshow.actions';
import { Injectable } from '@angular/core';

export interface SlideshowStateModel {
  [key: string]: Slideshow;
}

@State<SlideshowStateModel>({
  name: 'slideshow',
  defaults: { determination: determinationhelper },
})
@Injectable()
export class SlideshowState {
  // TODO: Remove this ugly loading mechanism. (New API needed)
  private _loadingSlideshows: string[] = [];

  constructor(private _http: HttpClient) {}

  @Selector()
  public static getSlideshowById(state: SlideshowStateModel) {
    // This redundant variable is required
    // https://github.com/ng-packagr/ng-packagr/issues/696
    const fn = function (id: string): Slideshow | undefined {
      return state[id];
    };
    return fn;
  }

  @Action(SlideshowLoadContentAction)
  public async contentLoad(
    ctx: StateContext<SlideshowStateModel>,
    { id }: SlideshowLoadContentAction
  ) {
    return new Promise(async (resolve) => {
      if (this._loadingSlideshows.includes(id)) {
        resolve();
        return;
      }
      this._loadingSlideshows.push(id);
      const slideshow = ctx.getState()[id];

      const newPages = await Promise.all(
        slideshow.pages.map(async (v) => {
          if (!v.content) {
            const result = await this._http
              .get(v.contentPath, { responseType: 'text' })
              .toPromise();
            return { ...v, content: result };
          }
          return v;
        })
      );

      ctx.patchState({
        [id]: { ...slideshow, pages: newPages },
      });
      this._loadingSlideshows = this._loadingSlideshows.filter((v) => v !== id);
      resolve();
    });
  }
}
