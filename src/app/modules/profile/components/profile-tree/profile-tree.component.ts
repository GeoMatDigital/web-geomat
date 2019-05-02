import {FlatTreeControl} from '@angular/cdk/tree';
import {AfterViewInit, Component, ElementRef, HostListener, ViewChild} from '@angular/core';
import {MatTreeFlatDataSource, MatTreeFlattener} from '@angular/material/tree';
import {ActivatedRoute, Router} from '@angular/router';
import {activateRoutes} from '@angular/router/src/operators/activate_routes';
import {select, Store} from '@ngrx/store';
import {of as observableOf, Subscription} from 'rxjs';
import {BaseComponent} from '../../../../shared/abstract/base.component';
import {ImageFiles} from '../../../../shared/models';
import {ProfileService} from '../../services/profile.service';
import {MineralProfile, Profile, ProfileAppState, ProfileCategory} from '../../state/profile.model';
import {selectProfile, selectProfiles} from '../../state/selectors';
import {BreakpointObserver} from "@angular/cdk/layout";

export type FlatTreeNode = MineralNode | CategoryNode;

export interface MineralNode {
  type: 'mineral'
  level: number;
  imageFiles: ImageFiles;
  imageLoaded: boolean;
  expandable: false,
  id: number;
}

export interface CategoryNode {
  type: 'category';
  title: string;
  info: string | null;
  level: number;
  expandable: boolean;
}

@Component({
  selector: 'app-profile-tree',
  templateUrl: './profile-tree.component.html',
  styleUrls: ['./profile-tree.component.scss'],
})
export class ProfileTreeComponent extends BaseComponent implements AfterViewInit {
  @ViewChild('contentContainer') public ContentContainer!: ElementRef;
  public SplitLayout: boolean = false;
  public Selected?: number = undefined;
  public SelectedProfile?: MineralProfile;
  private SelectedCategory?: ProfileCategory;
  public CanSwipeLeft = false;
  public CanSwipeRight = false;

  /** The MatTreeFlatDataSource connects the control and flattener to provide data. */
  public DataSource: MatTreeFlatDataSource<Profile, FlatTreeNode>;
  /** The TreeControl controls the expand/collapse state of tree nodes.  */
  public readonly TreeControl: FlatTreeControl<FlatTreeNode>;

  /** The TreeFlattener is used to generate the flat list of items from hierarchical data. */
  private readonly _treeFlattener: MatTreeFlattener<Profile, FlatTreeNode>;

  private _storeSub?: Subscription;


  constructor(
    private _service: ProfileService,
    private _store: Store<ProfileAppState>,
    private _router: Router,
    route: ActivatedRoute,
  ) {
    super();
    this._service.loadProfiles();

    this._treeFlattener = new MatTreeFlattener(
      ProfileTreeComponent.transformer,
      ProfileTreeComponent.getLevel,
      ProfileTreeComponent.isExpandable,
      node => ProfileTreeComponent.getChildren(node));

    this.TreeControl = new FlatTreeControl(ProfileTreeComponent.getLevel, ProfileTreeComponent.isExpandable);
    this.DataSource = new MatTreeFlatDataSource(this.TreeControl, this._treeFlattener);
    this.addSub(this._store.pipe(select(selectProfiles)).subscribe(profiles => {
      this.DataSource.data = profiles;
    }));
    if (route.children[0] !== undefined) {
      route.children[0].params.subscribe(params => {
        this.selectProfile(parseInt(params.id, 10));
      });
    } else {
      this.selectProfile();
    }
  }

  /** Transform the data to something the tree can read. */
  static transformer(node: Profile, level: number): FlatTreeNode {
    if (node.type === 'category') {
      return {
        title: node.title,
        type: 'category',
        info: node.description,
        level: level,
        expandable: true,
      };
    } else {
      return {
        title: node.name,
        id: node.id,
        type: 'mineral',
        level: level,
        expandable: false,
        imageFiles: node.imageFiles,
        imageLoaded: false,
      };
    }
  }

  /** Get the level of the node */
  static getLevel(node: FlatTreeNode) {
    return node.level;
  }

  /** Get whether the node is expanded or not. */
  static isExpandable(node: FlatTreeNode) {
    return node.expandable;
  }

  /** Get the children for the node. */
  static getChildren(node: Profile) {
    if (node.type === 'category') {
      return observableOf(node.children);
    } else {
      return null;
    }
  }

  @HostListener('window:resize', ['$event'])
  public onResize(event: any) {
    this.calculateLayout();
  }

  /** Get whether the node has children or not. */
  public hasChild(index: number, node: FlatTreeNode) {
    return node.expandable;
  }

  public selectProfile(profileId?: number) {
    if (profileId) {
      this.Selected = profileId;
      this._router.navigate(['profile', profileId]);
      if (this._storeSub) this._storeSub.unsubscribe();
      this._storeSub = this._store.pipe(select(selectProfile, profileId)).subscribe(profile => {
        if (profile) {
          this.SelectedProfile = profile.profile;
          this.SelectedCategory = profile.category;
          const index = profile.category.children.indexOf(profile.profile);
          this.CanSwipeLeft = index > 0;
          this.CanSwipeRight = index < profile.category.children.length - 1;
        }
      });
    } else {
      this.Selected = undefined;
      this.SelectedProfile = undefined;
    }
  }

  public swipeLeft() {
    if (this.SelectedCategory && this.SelectedProfile) {
      const index = this.SelectedCategory.children.indexOf(this.SelectedProfile);
      this.selectProfile((this.SelectedCategory.children[index - 1] as MineralProfile).id);
    }
  }

  public swipeRight() {
    if (this.SelectedCategory && this.SelectedProfile) {
      const index = this.SelectedCategory.children.indexOf(this.SelectedProfile);
      this.selectProfile((this.SelectedCategory.children[index + 1] as MineralProfile).id);
    }
  }

  public onImageLoaded(node: FlatTreeNode) {
    if (node.type === 'mineral') {
      node.imageLoaded = true;
    }
  }

  public ngAfterViewInit(): void {
    this.calculateLayout();
  }

  private calculateLayout() {
    const split = this.ContentContainer.nativeElement.clientWidth >= 800;
    if (split !== this.SplitLayout) {
      setTimeout(() => {
        this.SplitLayout = split;
      }, 0);
    }
  }

  public onPanEnd($event: any) {
    if ($event.deltaX > 100 && this.CanSwipeLeft) {
      this.swipeLeft();
    } else if ($event.deltaX < -100 && this.CanSwipeRight) {
      this.swipeRight();
    }
  }

}
