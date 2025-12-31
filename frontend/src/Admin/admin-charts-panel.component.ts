import { Component, Input, OnChanges } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-admin-charts-panel',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './admin-charts-panel.component.html',
  styleUrls: ['./admin-charts-panel.component.css']
})
export class AdminChartsPanelComponent implements OnChanges {
  @Input() userStats: any[] = [];
  @Input() appointmentStats: any[] = [];
  @Input() loading: boolean = false;

  userChartData: any = null;
  appointmentChartData: any = null;

  ngOnChanges() {
    this.userChartData = this.buildUserChartData();
    this.appointmentChartData = this.buildAppointmentChartData();
  }

  buildLinePath(points: any[], width: number, height: number, padding: number): string {
    if (!points || points.length === 0) return "";

    const xs = points.map((p) => p.x);
    const ys = points.map((p) => p.y);

    const minX = Math.min(...xs);
    const maxX = Math.max(...xs);
    const minY = Math.min(...ys);
    const maxY = Math.max(...ys);

    const spanX = maxX - minX || 1;
    const spanY = maxY - minY || 1;

    const innerW = width - padding * 2;
    const innerH = height - padding * 2;

    const toSvg = (p: any) => {
      const xNorm = (p.x - minX) / spanX;
      const yNorm = (p.y - minY) / spanY;
      const x = padding + xNorm * innerW;
      const y = padding + (1 - yNorm) * innerH;
      return { x, y };
    };

    return points
      .map((p, idx) => {
        const { x, y } = toSvg(p);
        return `${idx === 0 ? "M" : "L"} ${x} ${y}`;
      })
      .join(" ");
  }

  buildUserChartData() {
    if (!this.userStats || this.userStats.length === 0) return null;

    const width = 360;
    const height = 110;
    const padding = 16;

    const withIndex = this.userStats.map((d, idx) => ({
      idx,
      date: d.date,
      newCustomers: d.newCustomers,
      activeAgents: d.activeAgents,
    }));

    const customerPoints = withIndex.map((d) => ({
      x: d.idx,
      y: d.newCustomers,
    }));
    const agentPoints = withIndex.map((d) => ({
      x: d.idx,
      y: d.activeAgents,
    }));

    const customerPath = this.buildLinePath(
      customerPoints,
      width,
      height,
      padding
    );
    const agentPath = this.buildLinePath(agentPoints, width, height, padding);

    const xLabels = withIndex.map((d) => ({
      idx: d.idx,
      date: d.date,
    }));

    return {
      width,
      height,
      padding,
      customerPath,
      agentPath,
      xLabels,
    };
  }

  buildAppointmentChartData() {
    if (!this.appointmentStats || this.appointmentStats.length === 0) return null;

    const width = 360;
    const height = 110;
    const padding = 16;

    const withIndex = this.appointmentStats.map((d: any, idx) => ({
      idx,
      date: d.date,
      count: d.newUsers ?? d.count ?? d.newAppointments ?? d.total, // be flexible
    }));

    const points = withIndex.map((d) => ({
      x: d.idx,
      y: d.count || 0,
    }));

    const path = this.buildLinePath(points, width, height, padding);
    const xLabels = withIndex.map((d) => ({
      idx: d.idx,
      date: d.date,
    }));

    return {
      width,
      height,
      padding,
      path,
      xLabels,
    };
  }

  // Helper for template to calculate axis label X position
  calculateXLabel(idx: number, totalLabels: number, width: number, padding: number): number {
    return padding + (idx / Math.max(totalLabels - 1, 1)) * (width - padding * 2);
  }
}
