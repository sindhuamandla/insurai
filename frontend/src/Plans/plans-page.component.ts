import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { PlanService, Plan } from './plan.service';
import { AuthService } from '../Auth/auth.service';

const CATEGORY_TABS = ["All", "Car", "Bike", "House", "Life", "Health", "Other"];
const SORT_OPTIONS = ["Most Popular", "Price Low–High", "Price High–Low", "Coverage"];

@Component({
  selector: 'app-plans-page',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './plans-page.component.html',
  styleUrls: ['./plans-page.component.css']
})
export class PlansPageComponent implements OnInit {
  categoryTabs = CATEGORY_TABS;
  sortOptions = SORT_OPTIONS;

  plans: Plan[] = [];
  activeCategory = "All";
  search = "";
  sortBy = "Most Popular";
  selectedPlans: number[] = [];
  detailPlan: Plan | null = null;
  loading = false;
  error = "";

  constructor(
    private planService: PlanService,
    private router: Router,
    private authService: AuthService,
    private cdr: ChangeDetectorRef
  ) { }

  ngOnInit() {
    this.loadPlans();
  }

  get auth() {
    return this.authService.getAuthData();
  }

  loadPlans() {
    this.loading = true;
    this.error = "";
    this.planService.getPlans().subscribe({
      next: (data) => {
        this.plans = Array.isArray(data) ? data : [];
        this.loading = false;
        this.cdr.detectChanges();
      },
      error: (err) => {
        console.error("Failed to load plans", err);
        this.error = "Could not load plans. Please try again.";
        this.loading = false;
        this.cdr.detectChanges();
      }
    });
  }

  get filteredPlans(): Plan[] {
    let arr = this.plans;

    if (this.activeCategory !== "All") {
      arr = arr.filter(
        (p) => (p.category || "").toUpperCase() === this.activeCategory.toUpperCase()
      );
    }

    const q = this.search.toLowerCase();
    if (q) {
      arr = arr.filter(
        (p) =>
          (p.name || "").toLowerCase().includes(q) ||
          (p.provider || "").toLowerCase().includes(q)
      );
    }

    return arr.sort((a, b) => {
      if (this.sortBy === "Price Low–High") {
        return (a.basePremium || 0) - (b.basePremium || 0);
      }
      if (this.sortBy === "Price High–Low") {
        return (b.basePremium || 0) - (a.basePremium || 0);
      }
      if (this.sortBy === "Coverage") {
        return (b.coverageAmount || 0) - (a.coverageAmount || 0);
      }
      // Most Popular – use isBestValue as proxy
      return (b.isBestValue ? 1 : 0) - (a.isBestValue ? 1 : 0);
    });
  }

  get comparePlansList(): Plan[] {
    return this.plans.filter((p) => this.selectedPlans.includes(p.id));
  }

  toggleCompare(id: number, event: any) {
    if (event.target.checked) {
      this.selectedPlans.push(id);
    } else {
      this.selectedPlans = this.selectedPlans.filter(pid => pid !== id);
    }
  }

  isCompareSelected(id: number): boolean {
    return this.selectedPlans.includes(id);
  }

  handleContactOrBook(plan: Plan) {
    if (!this.authService.isLoggedIn()) {
      this.router.navigate(['/login']);
      return;
    }
    // Navigate to scheduling with plan state or query param
    // The Scheduling page needs to know which plan. 
    // We can pass state.
    this.router.navigate(['/scheduling'], { state: { plan } });
  }

  goHome() {
    this.router.navigate(['/']);
  }

  scrollToCompare() {
    const el = document.getElementById("plans-compare-section");
    if (el) {
      el.scrollIntoView({ behavior: "smooth" });
    }
  }

  openBrochure(url: string) {
    window.open(url, "_blank");
  }

  getIcon(category: string): string {
    if (category === "CAR") return "🚗";
    if (category === "BIKE") return "🏍️";
    if (category === "HOUSE") return "🏠";
    if (category === "LIFE") return "🛡️";
    return "📄";
  }

  get isAgent(): boolean {
    return this.authService.getRole() === 'AGENT';
  }
}
