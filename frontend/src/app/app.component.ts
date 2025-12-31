import { Component, OnInit } from '@angular/core';
import { RouterOutlet, Router } from '@angular/router';
import { AuthService } from '../Auth/auth.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet],
  template: `<router-outlet></router-outlet>`,
  styles: []
})
export class AppComponent implements OnInit {
  constructor(private authService: AuthService, private router: Router) { }

  ngOnInit() {
    this.authService.loadAuth();

    // Check for "from=google" param (migrated from React App.js)
    const urlParams = new URLSearchParams(window.location.search);
    if (urlParams.get('from') === 'google') {
      // In React it set state setScrollToFeaturesNext(true).
      // Here we can navigate to home with a fragment or state.
      // For now, just clear the param and go home.
      this.router.navigate(['/'], { replaceUrl: true });
    }
  }
}
