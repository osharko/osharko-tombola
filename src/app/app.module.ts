import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';
import { AppComponent } from './pages/app/app.component';
import { TombolaTableComponent } from './components/tombola-table/tombola-table.component';
import { UserTombolaTablesComponent } from './components/user-tombola-tables/user-tombola-tables.component';

@NgModule({
  imports: [BrowserModule, FormsModule],
  declarations: [AppComponent, TombolaTableComponent, UserTombolaTablesComponent],
  bootstrap: [AppComponent]
})
export class AppModule { }
