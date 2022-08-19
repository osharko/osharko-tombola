import { Component, Input } from '@angular/core';
import { TableTombola } from 'src/model/tombola';

@Component({
  selector: 'app-tombola-table',
  templateUrl: './tombola-table.component.html',
})
export class TombolaTableComponent {
  @Input() public table: TableTombola;
}
