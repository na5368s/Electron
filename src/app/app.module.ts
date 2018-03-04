import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';


import { AppComponent } from './app.component';
import { HeroesComponent } from './heroes/heroes.component';
import { HeroDetailComponent } from './hero-detail/hero-detail.component';
import {HeroService} from './hero.service';
import { MessagesComponent } from './messages/messages.component';
import { MessageService } from './message.service';
import { AppRoutingModule } from './app-routing.module';
import { DumpImportComponent } from './dump-import/dump-import.component';
import { DumpExportComponent } from './dump-export/dump-export.component';
import { CheckUpdatesComponent } from './check-updates/check-updates.component';
import { PrepareUpgradeComponent } from './prepare-upgrade/prepare-upgrade.component';
import { UpgradeComponent } from './upgrade/upgrade.component';


@NgModule({
  declarations: [
    AppComponent,
    HeroesComponent,
    HeroDetailComponent,
    MessagesComponent,
    DumpImportComponent,
    DumpExportComponent,
    CheckUpdatesComponent,
    PrepareUpgradeComponent,
    UpgradeComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    AppRoutingModule
  ],
  providers: [
    HeroService,
    MessageService,
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
