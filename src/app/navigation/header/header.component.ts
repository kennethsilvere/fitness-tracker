import { Component, OnInit, Output, EventEmitter, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';

import { AuthService } from '../../auth/auth.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit, OnDestroy {

  isAuthenticated = false;

  @Output() toggleSidenav = new EventEmitter<void>();

  authServiceSubscription = new Subscription();

  constructor(private authService: AuthService) { }

  ngOnInit() {
    this.authServiceSubscription = this.authService.authChange.subscribe(authState => {
      this.isAuthenticated = authState;
    });
  }

  onToggleSidenav() {
    this.toggleSidenav.emit();
  }

  onLogout() {
    this.authService.logout();
  }

  ngOnDestroy() {
    if (this.authServiceSubscription) {
      this.authServiceSubscription.unsubscribe();
    }
  }

}
