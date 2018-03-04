import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HeroesComponent } from './heroes/heroes.component';
import {DumpImportComponent} from './dump-import/dump-import.component';
import {DumpExportComponent} from './dump-export/dump-export.component';
import {CheckUpdatesComponent} from './check-updates/check-updates.component';
import {PrepareUpgradeComponent} from './prepare-upgrade/prepare-upgrade.component';
import {UpgradeComponent} from './upgrade/upgrade.component';

const routes: Routes = [
  {
    path: 'heroes',
    component: HeroesComponent
  },
  {
    path: 'import',
    component: DumpImportComponent
  },
  {
    path: 'export',
    component: DumpExportComponent
  },
  {
    path: 'check-updates',
    component: CheckUpdatesComponent
  },
  {
    path: 'prepare-upgrade',
    component: PrepareUpgradeComponent
  },
  {
    path: 'upgrade',
    component: UpgradeComponent
  }
]

@NgModule({
  imports: [ RouterModule.forRoot(routes)],
  exports: [ RouterModule ]
})
export class AppRoutingModule { }
