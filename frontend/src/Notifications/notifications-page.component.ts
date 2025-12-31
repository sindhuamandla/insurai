import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { NotificationService, Notification } from './notification.service';
import { SupportService, SupportTicket } from '../Contact/support.service';
import { AuthService } from '../Auth/auth.service';

@Component({
  selector: 'app-notifications-page',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './notifications-page.component.html',
  styleUrls: ['./notifications-page.component.css']
})
export class NotificationsPageComponent implements OnInit {
  notifications: Notification[] = [];
  loading = true;
  error = '';
  search = '';
  typeFilter = 'All';
  unreadOnly = false;
  selected: Notification | null = null;

  // Support Ticket Logic
  activeTab: 'notifications' | 'support' = 'notifications';
  supportTickets: SupportTicket[] = [];
  supportLoading = false;
  selectedTicket: SupportTicket | null = null;

  constructor(
    private notificationService: NotificationService,
    private router: Router,
    private authService: AuthService,
    private cdr: ChangeDetectorRef,
    private supportService: SupportService
  ) { }

  get auth() {
    return this.authService.getAuthData();
  }

  goHome() {
    this.router.navigate(['/']);
  }

  ngOnInit() {
    this.loadNotifications();
    this.loadSupportTickets(); // Preload or load on tab switch
  }

  setActiveTab(tab: 'notifications' | 'support') {
    this.activeTab = tab;
    // Clear selection when switching context if desired
    // this.selected = null;
    // this.selectedTicket = null;
  }

  loadSupportTickets() {
    this.supportLoading = true;
    this.supportService.getMyTickets().subscribe({
      next: (data) => {
        this.supportTickets = data || [];
        if (this.supportTickets.length > 0) {
          this.selectedTicket = this.supportTickets[0];
        }
        this.supportLoading = false;
        this.cdr.detectChanges();
      },
      error: (err) => {
        console.error("Failed to load support tickets", err);
        this.supportLoading = false;
        this.cdr.detectChanges();
      }
    });
  }

  loadNotifications() {
    this.loading = true;
    this.error = '';

    this.notificationService.getMyNotifications().subscribe({
      next: (data) => {
        // Debug logging to inspect incoming data
        console.log("Loaded notifications:", data);

        this.notifications = (data || []).map((n: any) => ({
          ...n,
          isRead: n.read || n.isRead || false,
          type: n.type || 'INFO',
          title: n.title || 'Notification',
          message: n.message || '',
          data: n.data || {},
          // Ensure createdAt is preserved even if null/undefined
          createdAt: n.createdAt
        }));
        if (this.notifications.length > 0) {
          this.selected = this.notifications[0];
        }
        this.loading = false;
        this.cdr.detectChanges();
      },
      error: (err) => {
        console.error("Failed to load notifications", err);
        this.error = "Could not load notifications. Please try again.";
        this.loading = false;
        this.cdr.detectChanges();
      }
    });
  }

  get filteredNotifications(): Notification[] {
    return this.notifications.filter((n) => {
      const q = this.search.trim().toLowerCase();
      const textMatch =
        !q ||
        (n.title || "").toLowerCase().includes(q) ||
        (n.message || "").toLowerCase().includes(q);
      const typeMatch =
        this.typeFilter === "All"
          ? true
          : (n.type || "").toUpperCase() === this.typeFilter.toUpperCase();
      const readMatch = this.unreadOnly ? !n.isRead : true;
      return textMatch && typeMatch && readMatch;
    });
  }

  getTypeColor(type: string): string {
    const t = (type || "INFO").toUpperCase();
    if (t === "APPOINTMENT") return "#3b82f6";
    if (t === "APPOINTMENT_STATUS_CHANGED") return "#f59e0b";
    if (t === "PROMOTION") return "#f59e0b";
    if (t === "ALERT") return "#ef4444";
    if (t === "SUCCESS") return "#10b981";
    return "#6b7280";
  }

  getTypeIcon(type: string): string {
    const t = (type || "INFO").toUpperCase();
    if (t === "APPOINTMENT") return "📅";
    if (t === "APPOINTMENT_STATUS_CHANGED") return "📋";
    if (t === "PROMOTION") return "🎁";
    if (t === "ALERT") return "⚠️";
    if (t === "SUCCESS") return "✅";
    return "ℹ️";
  }

  formatTime(iso: string | undefined): string {
    if (!iso) return "-";
    const d = new Date(iso);
    if (isNaN(d.getTime())) return "-";

    const now = new Date();
    const diff = now.getTime() - d.getTime();
    const mins = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);
    const days = Math.floor(diff / 86400000);

    if (mins < 1) return "Just now";
    if (mins < 60) return `${mins}m ago`;
    if (hours < 24) return `${hours}h ago`;
    if (days < 7) return `${days}d ago`;
    return d.toLocaleDateString(undefined, {
      month: "short",
      day: "numeric",
    });
  }

  formatDateDetail(iso: string | undefined): string {
    if (!iso) return "-";
    const d = new Date(iso);
    if (isNaN(d.getTime())) return "Invalid Date";

    return d.toLocaleString(undefined, {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  }

  handleRowClick(notif: Notification) {
    this.selected = notif;
    if (!notif.isRead) {
      this.markNotificationAsRead(notif.id);
    }
  }

  markNotificationAsRead(notificationId: number) {
    this.notificationService.markRead(notificationId).subscribe({
      next: () => {
        this.notifications = this.notifications.map((n) =>
          n.id === notificationId ? { ...n, isRead: true } : n
        );
        if (this.selected && this.selected.id === notificationId) {
          this.selected.isRead = true;
        }
      },
      error: (err) => console.error("Failed to mark notification as read", err)
    });
  }

  handleMarkAllAsRead() {
    this.notificationService.markAllRead().subscribe({
      next: () => {
        this.notifications = this.notifications.map((n) => ({ ...n, isRead: true }));
        if (this.selected) {
          this.selected.isRead = true;
        }
      },
      error: (err) => {
        console.error("Failed to mark all as read", err);
        alert("Could not mark all as read. Please try again.");
      }
    });
  }

  hasData(data: any): boolean {
    return data && Object.keys(data).length > 0;
  }
}
