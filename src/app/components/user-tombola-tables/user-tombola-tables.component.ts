import { Component, Input } from '@angular/core';
import { TableTombola } from 'src/model/tombola';

@Component({
  selector: 'app-user-tombola-tables',
  templateUrl: './user-tombola-tables.component.html',
})
export class UserTombolaTablesComponent {
  @Input() public user: string;
  @Input() public tables: TableTombola[];
}
