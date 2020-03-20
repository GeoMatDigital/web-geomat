import {FlatTreeControl} from '@angular/cdk/tree';
import {Component, EventEmitter, Input, Output} from '@angular/core';
import {MatTreeFlatDataSource, MatTreeFlattener} from '@angular/material/tree';
import {of as observableOf} from 'rxjs';
import {ImageFiles} from '../../../../shared/models';
import {ProfileService} from '../../services/profile.service';
import {Profile} from '../../state/profile.model';
import {Store} from "@ngxs/store";

export type FlatTreeNode = MineralNode | CategoryNode;

export interface MineralNode {
  title: string;
  type: 'mineral';
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
export class ProfileTreeComponent {
  @Output() onProfileSelect = new EventEmitter<number>();
  @Input() selectedProfileId?: number;


  /** The MatTreeFlatDataSource connects the control and flattener to provide data. */
  public DataSource: MatTreeFlatDataSource<Profile, FlatTreeNode>;
  /** The TreeControl controls the expand/collapse state of tree nodes.  */
  public readonly TreeControl: FlatTreeControl<FlatTreeNode>;

  /** The TreeFlattener is used to generate the flat list of items from hierarchical data. */
  private readonly _treeFlattener: MatTreeFlattener<Profile, FlatTreeNode>;

  private _selectedNode: CategoryNode | MineralNode | null = null;


  constructor(
    private _service: ProfileService,
    private _store: Store,
  ) {
    this._treeFlattener = new MatTreeFlattener(
      ProfileTreeComponent.transformer,
      ProfileTreeComponent.getLevel,
      ProfileTreeComponent.isExpandable,
      node => ProfileTreeComponent.getChildren(node));

    this.TreeControl = new FlatTreeControl(ProfileTreeComponent.getLevel, ProfileTreeComponent.isExpandable);
    this.DataSource = new MatTreeFlatDataSource(this.TreeControl, this._treeFlattener);
    this._store.select(s => s.profile).subscribe(profiles => {
      this.DataSource.data = profiles;
    });
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
        title: node.variety ? node.variety : node.mineralName,
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

  /** Get whether the node has children or not. */
  public hasChild(index: number, node: FlatTreeNode) {
    return node.expandable;
  }

  public onImageLoaded(node: FlatTreeNode) {
    if (node.type === 'mineral') {
      node.imageLoaded = true;
    }
  }

  onNodeClick(node: MineralNode | CategoryNode) {
    if (this.TreeControl.isExpanded(node)) {
      this.TreeControl.collapse(node);
      this._selectedNode = null;
    } else {
      if (this._selectedNode) {
          const children = this.TreeControl.getDescendants(this._selectedNode);
          if (!children || (Array.isArray(children) && !children.includes(node))) {
            this.TreeControl.collapse(this._selectedNode);
          this.TreeControl.dataNodes.forEach(n => {
            const c = this.TreeControl.getDescendants(n);
            if (c && Array.isArray(c) && c.includes(this._selectedNode!) && !c.includes(node)) {
              this.TreeControl.collapse(n);
            }
          })
          }
        }
      this.TreeControl.expand(node);
      this._selectedNode = node;
    }
  }
}
