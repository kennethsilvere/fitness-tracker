import { Component, OnInit, Output, EventEmitter } from '@angular/core';

import { AuthService } from '../../auth/auth.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {

  isAuthenticated = false;

  @Output() toggleSidenav = new EventEmitter<void>();

  constructor(private authService: AuthService) { }

  ngOnInit() {
    this.authService.authChange.subscribe(authState => {
      this.isAuthenticated = authState;
    });
  }

  onToggleSidenav() {
    this.toggleSidenav.emit();
  }

  onLogout() {
    this.authService.logout();
  }

}
