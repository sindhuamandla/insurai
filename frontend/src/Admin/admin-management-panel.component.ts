import { Component, Input, OnInit, OnChanges, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AdminService, User, Plan } from './admin.service';

@Component({
  selector: 'app-admin-management-panel',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './admin-management-panel.component.html',
  styleUrls: ['./admin-management-panel.component.css']
})
export class AdminManagementPanelComponent implements OnInit, OnChanges {
  @Input() mode: 'users' | 'policies' = 'users';
  @Input() onSelectItem: (item: any) => void = () => { };

  activeTab: 'users' | 'policies' = 'users';

  users: User[] = [];
  plans: Plan[] = [];
  loading: boolean = false;
  error: string = "";

  roleUpdateLoadingId: number | null = null;
  statusUpdateLoadingId: number | null = null;

  planEdit: Partial<Plan> | null = null;
  planSaving: boolean = false;

  // policy charts data
  policyCategoryStats: any[] = [];
  policyUsageStats: any[] = [];
  policyStatsLoading: boolean = false;

  createAgentOpen: boolean = false;
  newAgent = { name: "", email: "", phone: "", password: "" };
  agentCreating: boolean = false;

  constructor(private adminService: AdminService, private cdr: ChangeDetectorRef) { }

  ngOnInit() {
    this.refreshData();
  }

  ngOnChanges() {
    this.refreshData();
  }

  refreshData() {
    this.activeTab = this.mode === 'policies' ? 'policies' : 'users';
    this.loadData();
    this.loadPolicyStats();
  }

  loadData() {
    this.loading = true;
    this.error = "";

    if (this.mode === 'users') {
      this.adminService.getUsers().subscribe({
        next: (data) => {
          this.users = data || [];
          this.loading = false;
          this.cdr.detectChanges();
        },
        error: (err) => {
          console.error("Failed to load admin data", err);
          this.error = "Could not load admin data. Please try again.";
          this.loading = false;
          this.cdr.detectChanges();
        }
      });
    } else {
      this.adminService.getPlans().subscribe({
        next: (data) => {
          this.plans = data || [];
          this.loading = false;
          this.cdr.detectChanges();
        },
        error: (err) => {
          console.error("Failed to load admin data", err);
          this.error = "Could not load admin data. Please try again.";
          this.loading = false;
          this.cdr.detectChanges();
        }
      });
    }
  }

  loadPolicyStats() {
    this.policyStatsLoading = true;
    // Using forkJoin equivalent or just separate subscriptions for simplicity in quick migration, 
    // but React code used Promise.all. I'll use separate calls or merge them.
    // Let's just call them.
    this.adminService.getPolicyCategoryStats().subscribe({
      next: (data) => this.policyCategoryStats = data || [],
      error: (err) => console.error(err)
    });
    this.adminService.getPolicyUsageStats().subscribe({
      next: (data) => {
        this.policyUsageStats = data || [];
        this.policyStatsLoading = false;
        this.cdr.detectChanges();
      },
      error: (err) => {
        console.error(err);
        this.policyStatsLoading = false;
        this.cdr.detectChanges();
      }
    });
  }

  get visibleUsers() {
    return this.activeTab === 'users' ? this.users : this.users.filter(u => u.role === 'AGENT');
  }

  handleRoleChange(user: User, newRole: string) {
    if (newRole === user.role) return;
    this.roleUpdateLoadingId = user.id;
    this.error = "";

    this.adminService.updateUserRole(user.id, newRole).subscribe({
      next: (updated) => {
        this.users = this.users.map(u => u.id === updated.id ? updated : u);
        this.roleUpdateLoadingId = null;
      },
      error: (err) => {
        console.error("Failed to update role", err);
        this.error = "Could not update user role. Please try again.";
        this.roleUpdateLoadingId = null;
      }
    });
  }

  handleStatusToggle(user: User) {
    this.statusUpdateLoadingId = user.id;
    this.error = "";

    this.adminService.updateUserStatus(user.id, !user.enabled).subscribe({
      next: (updated) => {
        this.users = this.users.map(u => u.id === updated.id ? updated : u);
        this.statusUpdateLoadingId = null;
        this.cdr.detectChanges();
      },
      error: (err) => {
        console.error("Failed to update status", err);
        this.error = "Could not update user status. Please try again.";
        this.statusUpdateLoadingId = null;
        this.cdr.detectChanges();
      }
    });
  }

  startCreatePlan() {
    this.planEdit = {
      name: "",
      category: "",
      premiumAmount: 0,
      coverageAmount: 0,
      active: true,
      description: "",
    };
  }

  startEditPlan(plan: Plan) {
    this.planEdit = { ...plan };
  }

  cancelPlanEdit() {
    this.planEdit = null;
  }

  savePlan() {
    if (!this.planEdit) return;
    const payload = {
      ...this.planEdit,
      name: this.planEdit.name?.trim(),
      category: this.planEdit.category?.trim(),
      premiumAmount: Number(this.planEdit.premiumAmount) || 0,
      coverageAmount: Number(this.planEdit.coverageAmount) || 0,
      description: this.planEdit.description?.trim(),
    };

    if (!payload.name) {
      this.error = "Plan name is required.";
      return;
    }

    this.planSaving = true;
    this.error = "";

    this.adminService.savePlan(payload).subscribe({
      next: (saved) => {
        const exists = this.plans.some(p => p.id === saved.id);
        if (exists) {
          this.plans = this.plans.map(p => p.id === saved.id ? saved : p);
        } else {
          this.plans = [...this.plans, saved];
        }
        this.planEdit = null;
        this.planSaving = false;
        this.cdr.detectChanges();
      },
      error: (err) => {
        console.error("Failed to save plan", err);
        this.error = "Could not save policy plan. Please try again.";
        this.planSaving = false;
        this.cdr.detectChanges();
      }
    });
  }

  togglePlanStatus(plan: Plan) {
    this.error = "";
    this.adminService.updatePlanStatus(plan.id, !plan.active).subscribe({
      next: (saved) => {
        this.plans = this.plans.map(p => p.id === saved.id ? saved : p);
      },
      error: (err) => {
        console.error("Failed to update plan status", err);
        this.error = "Could not update policy status. Please try again.";
      }
    });
  }

  deletePlan(plan: Plan) {
    if (!window.confirm(`Are you sure you want to delete policy: ${plan.name}?`)) return;
    this.error = "";
    this.adminService.deletePlan(plan.id).subscribe({
      next: () => {
        this.plans = this.plans.filter(p => p.id !== plan.id);
      },
      error: (err) => {
        console.error("Failed to delete plan", err);
        this.error = "Could not delete policy plan. Please try again.";
      }
    });
  }

  handleCreateAgent() {
    this.agentCreating = true;
    this.error = "";
    this.adminService.createAgent(this.newAgent).subscribe({
      next: () => {
        this.createAgentOpen = false;
        this.newAgent = { name: "", email: "", phone: "", password: "" };
        this.agentCreating = false;
        this.loadData(); // refresh users
        alert("Agent created successfully!");
        this.cdr.detectChanges();
      },
      error: (err) => {
        console.error("Failed to create agent", err);
        this.error = err.error?.message || "Could not create agent. Please try again.";
        this.agentCreating = false;
        this.cdr.detectChanges();
      }
    });
  }

  // Chart helpers
  buildBarChartData(items: any[], valueKey: string) {
    if (!items || items.length === 0) return null;

    const width = 360;
    const height = 110;
    const padding = 16;

    const maxValue = Math.max(
      ...items.map((i) => Number(i[valueKey] || 0)),
      1
    );
    const barWidth = (width - padding * 2) / Math.max(items.length, 1) - 4;

    return {
      width,
      height,
      padding,
      barWidth,
      maxValue,
    };
  }

  calculateRectHeight(value: number, maxValue: number, height: number, padding: number): number {
    return (value / maxValue) * (height - padding * 2);
  }

  calculateRectY(height: number, padding: number, barHeight: number): number {
    return height - padding - barHeight;
  }
}
