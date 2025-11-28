import { Component, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { DataResetService } from './core/services/data-reset.service';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet],
  template: '<router-outlet></router-outlet>',
  styles: []
})
export class App implements OnInit {
  constructor(private dataResetService: DataResetService) {}

  ngOnInit(): void {
    // Reset all data on app initialization to ensure deterministic state
    this.dataResetService.resetAllData();
  }
}
