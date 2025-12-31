import { Component, OnInit, OnDestroy, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AdminService, DashboardSummary } from './admin.service';
import { AdminKpiRowComponent } from './admin-kpi-row.component';
import { AdminChartsPanelComponent } from './admin-charts-panel.component';
import { AdminManagementPanelComponent } from './admin-management-panel.component';

@Component({
  selector: 'app-admin-dashboard',
  standalone: true,
  imports: [CommonModule, AdminKpiRowComponent, AdminChartsPanelComponent, AdminManagementPanelComponent],
  templateUrl: './admin-dashboard.component.html',
  styleUrls: ['./admin-dashboard.component.css']
})
export class AdminDashboardComponent implements OnInit, OnDestroy {
  summary: DashboardSummary | null = null;
  userStats: any[] = [];
  appointmentStats: any[] = [];
  recentAppointments: any[] = [];
  latestUsers: any[] = [];

  activeSection: 'dashboard' | 'users' | 'policies' = 'dashboard';

  loading: boolean = false;
  chartsLoading: boolean = false;
  error: string = "";

  private intervalId: any;

  constructor(private adminService: AdminService, private cdr: ChangeDetectorRef) { }

  ngOnInit() {
    this.loadDashboard();

    // refresh charts every 60s
    this.intervalId = setInterval(() => {
      this.loadChartsOnly();
    }, 60000);
  }

  ngOnDestroy() {
    if (this.intervalId) {
      clearInterval(this.intervalId);
    }
  }

  loadDashboard() {
    this.loading = true;
    this.error = "";

    // We can use forkJoin but to keep it simple and readable
    this.adminService.getSummary().subscribe({
      next: (res) => {
        this.summary = res;
        this.cdr.detectChanges();
      },
      error: (err) => {
        console.error("Failed to load summary", err);
        this.error = "Could not load dashboard data. Please try again.";
        this.cdr.detectChanges();
      }
    });

    this.adminService.getDailyUserStats().subscribe({
      next: (res) => this.userStats = res || [],
      error: (err) => console.error(err)
    });

    this.adminService.getDailyAppointmentStats().subscribe({
      next: (res) => this.appointmentStats = res || [],
      error: (err) => console.error(err)
    });

    this.adminService.getRecentAppointments().subscribe({
      next: (res) => this.recentAppointments = res || [],
      error: (err) => console.error(err)
    });

    this.adminService.getLatestUsers().subscribe({
      next: (res) => {
        this.latestUsers = res || [];
        this.loading = false;
        this.cdr.detectChanges();
      },
      error: (err) => {
        console.error(err);
        this.loading = false;
        this.cdr.detectChanges();
      }
    });
  }

  loadChartsOnly() {
    this.chartsLoading = true;
    this.adminService.getDailyUserStats().subscribe({
      next: (res) => this.userStats = res || [],
      error: (err) => console.error(err)
    });
    this.adminService.getDailyAppointmentStats().subscribe({
      next: (res) => {
        this.appointmentStats = res || [];
        this.chartsLoading = false;
        this.cdr.detectChanges();
      },
      error: (err) => {
        console.error(err);
        this.chartsLoading = false;
        this.cdr.detectChanges();
      }
    });
  }

  get kpiStats() {
    return this.summary ? {
      appointments: {
        today: this.summary.todaysAppointments || 0,
        last7Days: this.summary.last7DaysAppointments || 0,
        allTime: this.summary.allTimeAppointments || 0
      },
      customers: this.summary.totalCustomers || 0,
      agents: this.summary.totalAgents || 0,
      plans: this.summary.totalPlans || 0
    } : null;
  }

  handleCardClick(target: string) {
    if (target === 'customers') this.activeSection = 'users';
    if (target === 'plans') this.activeSection = 'policies';
  }

  setActiveSection(section: 'dashboard' | 'users' | 'policies') {
    this.activeSection = section;
  }
}
