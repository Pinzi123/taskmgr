import {ChangeDetectionStrategy, Component, EventEmitter, Output} from '@angular/core';
import {getDate} from 'date-fns';
import {Store} from '@ngrx/store';
import {Observable} from 'rxjs/Observable';
import {Auth, Project} from '../../domain';
import * as fromRoot from '../../reducers';
import * as actions from '../../actions/project.action';

@Component({
  selector: 'app-sidebar',
  template: `
    <div *ngIf="(auth$ | async)?.user">
      <md-nav-list>
        <h3 mdSubheader>项目</h3>
        <md-list-item [routerLink]="['/projects']" (click)="handleClicked($event)">
          <md-icon md-list-icon svgIcon="projects"></md-icon>
          <span mdLine>项目首页</span>
          <span mdLine mdSubheader> 查看您参与的全部项目 </span>
        </md-list-item>
        <md-list-item *ngFor="let prj of projects$ | async" (click)="handlePrjClicked($event, prj)">
          <md-icon md-list-icon svgIcon="project"></md-icon>
          <a mdLine>
            {{prj.name}}
          </a>
          <span mdLine mdSubheader> {{prj.desc}} </span>
        </md-list-item>
        <md-divider></md-divider>
        <h3 mdSubheader>日历</h3>
        <md-list-item [routerLink]="['/mycal/month']" (click)="handleClicked($event)">
          <md-icon md-list-icon svgIcon="month"></md-icon>
          <span mdLine>月视图</span>
          <span mdLine mdSubheader> 按月方式查看事件 </span>
        </md-list-item>
        <md-list-item [routerLink]="['/mycal/week']" (click)="handleClicked($event)">
          <md-icon md-list-icon svgIcon="week"></md-icon>
          <span mdLine>星期视图</span>
          <span mdLine mdSubheader> 按星期方式查看事件 </span>
        </md-list-item>
        <md-list-item [routerLink]="['/mycal/day']" (click)="handleClicked($event)">
          <md-icon md-list-icon [svgIcon]="today"></md-icon>
          <span mdLine>当日视图</span>
          <span mdLine mdSubheader> 按天方式查看事件 </span>
        </md-list-item>
      </md-nav-list>
    </div>
  `,
  styles: [`
    .day-num {
      font-size: 48px;
      width: 48px;
      height: 48px;
    }

    md-icon {
      align-self: flex-start;
    }
  `],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SidebarComponent {
  @Output() navClicked = new EventEmitter<void>();

  today = 'day';
  projects$: Observable<Project[]>;
  auth$: Observable<Auth>;

  constructor(private store$: Store<fromRoot.State>) {
    this.auth$ = this.store$.select(fromRoot.getAuth);
    this.projects$ = this.store$.select(fromRoot.getProjects);
    this.today = `day${getDate(new Date())}`;
  }

  handleClicked(ev: Event) {
    ev.preventDefault();
    this.navClicked.emit();
  }

  handlePrjClicked(ev: Event, prj: Project) {
    ev.preventDefault();
    this.store$.dispatch(new actions.SelectProjectAction(prj));
    this.navClicked.emit();
  }
}
