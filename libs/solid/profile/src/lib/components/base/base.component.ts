import {
  AfterViewInit,
  Component,
  ElementRef,
  HostListener,
  Inject,
  OnInit,
  ViewChild,
} from '@angular/core';
import { Select, Store } from '@ngxs/store';
import { ProfileState } from '../../state/profile.state';
import { TreeNode, Profile } from '../../state/profile.model';
import { FormControl } from '@angular/forms';
import { Navigate } from '@ngxs/router-plugin';
import { map } from 'rxjs/operators';
import { BehaviorSubject, combineLatest, Observable } from 'rxjs';
import { Dispatch } from '@ngxs-labs/dispatch-decorator';
import { ProfileActions } from '../../state/profile.actions';
import { SOLID_PROFILE_BASE_URL } from '../../base-url';

export function __internal__selectRouterStateParams(s: any) {
  return s.router.state.params;
}

@Component({
  selector: 'solid-profile-base',
  templateUrl: './base.component.html',
  styleUrls: ['./base.component.scss'],
})
export class BaseComponent implements OnInit, AfterViewInit {
  @Select(ProfileState.selectTree)
  public $profilesTree!: Observable<TreeNode[]>;
  @Select(ProfileState.selectFlat)
  public $profilesFlat!: Observable<Profile[]>;
  @Select(ProfileState.selectProfileAndNode)
  public $profileAndCategorySelector!: Observable<
    (profileId?: number) => { profile: Profile; node: TreeNode } | null
  >;
  @Select(__internal__selectRouterStateParams)
  public $routerParams!: Observable<{ [key: string]: string }>;
  public ProfilesFlatFiltered = new BehaviorSubject<Profile[]>([]);
  @ViewChild('contentContainer', { static: false })
  public ContentContainer!: ElementRef;
  public SplitLayout = false;
  public Filter = new FormControl('');
  public FilterValue = new BehaviorSubject<string>('');
  public SelectedProfile: Profile | null = null;
  public SelectedNode: TreeNode | null = null;
  public SwipeLeft = -1;
  public SwipeRight = -1;
  public View = 'tree';

  constructor(
    private _store: Store,
    @Inject(SOLID_PROFILE_BASE_URL) public baseUrl: string
  ) {
    this._store.dispatch([
      new ProfileActions.LoadDefinition(),
      new ProfileActions.LoadProfiles(),
    ]);
  }

  ngOnInit(): void {
    combineLatest([
      this.$routerParams,
      this.$profileAndCategorySelector,
      this.$profilesFlat,
      this.FilterValue,
    ])
      .pipe(
        map((v) => {
          const { params, selector, flat, filterStr } = {
            params: v[0],
            selector: v[1],
            flat: v[2],
            filterStr: v[3],
          };

          // select profile
          const profileId =
            params.id !== undefined && params.id !== ''
              ? parseInt(params.id, 10)
              : undefined;
          const profileAndNode = selector(profileId);

          // filter profiles
          const regExp = new RegExp(filterStr, 'i');
          const profilesFlatFiltered = flat.filter((p) => {
            if (p.name.match(regExp)) {
              return true;
            }
            if (p.trivial_name) {
              return !!p.trivial_name.match(regExp);
            }
          });

          // no profile selected
          if (!profileId || !profileAndNode) {
            return {
              view: params.view,
              selectedProfile: null,
              selectedNode: null,
              profilesFlatFiltered,
              swipeRight: -1,
              swipeLeft: -1,
            };
          }
          let swipeRight = -1;
          let swipeLeft = -1;
          if (params.view === 'grid' || filterStr !== '') {
            const flatIndex = profilesFlatFiltered.findIndex(
              (p) => p.id === profileId
            );
            if (flatIndex !== 0) {
              swipeLeft = profilesFlatFiltered[flatIndex - 1]?.id || -1;
            }
            if (flatIndex !== profilesFlatFiltered.length - 1) {
              swipeRight = profilesFlatFiltered[flatIndex + 1]?.id || -1;
            }
          } else {
            // TODO: Handle indices for mixed leaf nodes and categories
            const index = profileAndNode.node.profiles.indexOf(
              profileAndNode.profile
            );
            if (!this.Filter.value) {
              swipeLeft =
                (profileAndNode.node.profiles.find(
                  (p, i) => i === index - 1
                ) as Profile | undefined)?.id || -1;
              swipeRight =
                (profileAndNode.node.profiles.find((p, i) => i > index) as
                  | Profile
                  | undefined)?.id || -1;
            }
          }
          return {
            view: params.view,
            selectedProfile: profileAndNode.profile,
            selectedNode: profileAndNode.node,
            profilesFlatFiltered,
            swipeRight,
            swipeLeft,
          };
        })
      )
      .subscribe((v) => {
        this.View = v.view;
        this.SelectedProfile = v.selectedProfile;
        this.SelectedNode = v.selectedNode;
        this.ProfilesFlatFiltered.next(v.profilesFlatFiltered);
        this.SwipeLeft = v.swipeLeft;
        this.SwipeRight = v.swipeRight;
      });
    this.Filter.valueChanges.subscribe((_) =>
      this.FilterValue.next(this.Filter.value)
    );
  }

  @HostListener('window:resize', ['$event'])
  public onResize() {
    this.calculateLayout();
  }

  public ngAfterViewInit(): void {
    this.calculateLayout();
  }

  @Dispatch()
  public toggleGridTree() {
    if (this.SelectedProfile) {
      return new Navigate(
        [
          `${this.baseUrl}`,
          this.View === 'tree' ? 'grid' : 'tree',
          this.SelectedProfile.id,
        ],
        undefined,
        { replaceUrl: true }
      );
    }
    return new Navigate(
      [`${this.baseUrl}`, this.View === 'tree' ? 'grid' : 'tree'],
      undefined,
      { replaceUrl: true }
    );
  }

  @Dispatch()
  public selectProfile(profileId?: number) {
    if (profileId) {
      return new Navigate([`${this.baseUrl}`, this.View, profileId]);
    }
    return new Navigate([`${this.baseUrl}`, this.View]);
  }

  public swipeLeft() {
    if (this.SwipeLeft > 0) {
      this.selectProfile(this.SwipeLeft);
    }
  }

  public swipeRight() {
    if (this.SwipeRight > 0) {
      this.selectProfile(this.SwipeRight);
    }
  }

  public onPanEnd($event: any) {
    if ($event.deltaX > 100 && this.SwipeLeft) {
      $event.preventDefault();
      this.swipeLeft();
    } else if ($event.deltaX < -100 && this.SwipeRight) {
      $event.preventDefault();
      this.swipeRight();
    }
  }

  private calculateLayout() {
    const split = this.ContentContainer.nativeElement.clientWidth >= 800;
    if (split !== this.SplitLayout) {
      setTimeout(() => {
        this.SplitLayout = split;
      }, 0);
    }
  }
}
