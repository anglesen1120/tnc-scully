import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { ScullyRoutesService } from '@scullyio/ng-lib';
import { Observable } from 'rxjs';
import { map, takeUntil } from 'rxjs/operators';
import { Destroyable } from '../shared/destroyable';
import { Frontmatter } from '../shared/frontmatter';
import { MetaService } from '../shared/services/meta.service';

@Component({
  selector: 'app-home',
  template: `
    <div class="grid col-gap-4 grid-cols-1 lg:grid-cols-4">
      <div class="col-span-4 lg:col-span-1">
        <div class="max-w-full lg:max-w-sm rounded overflow-hidden shadow-lg p-4">
          <app-avatar></app-avatar>
          <app-info></app-info>
          <app-navigation></app-navigation>
          <app-socials></app-socials>
          <app-copyright></app-copyright>
        </div>
      </div>
      <div class="col-span-4 lg:col-span-3">
        <div class="rounded overflow-hidden shadow-lg p-4 flex flex-col divide-y divide-gray-400">
          <app-blog-list *ngFor="let link of links$ | async" [route]="link"></app-blog-list>
        </div>
      </div>
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HomeComponent extends Destroyable implements OnInit {
  links$: Observable<Frontmatter[]>;

  constructor(
    private readonly scullyRoutesService: ScullyRoutesService,
    private readonly metaService: MetaService,
  ) {
    super();
  }

  ngOnInit(): void {
    this.metaService.resetMeta();
    this.links$ = this.scullyRoutesService.available$.pipe(
      map((links) => links.filter((l) => l.route !== '/' || l.title != null)),
      takeUntil(this.$destroyed),
    );
  }
}
