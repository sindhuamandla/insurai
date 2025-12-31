import { Component, OnInit, OnChanges, SimpleChanges, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { AppointmentSchedulingService, ScheduleAppointmentRequest } from './appointment-scheduling.service';
import { StepAgentSelectComponent } from './step-agent-select.component';
import { StepSlotSelectComponent } from './step-slot-select.component';
import { StepDetailsConfirmComponent } from './step-details-confirm.component';

@Component({
  selector: 'app-appointment-scheduling-page',
  standalone: true,
  imports: [
    CommonModule,
    StepAgentSelectComponent,
    StepSlotSelectComponent,
    StepDetailsConfirmComponent
  ],
  templateUrl: './appointment-scheduling-page.component.html',
  styleUrls: ['./appointment-scheduling-page.component.css']
})
export class AppointmentSchedulingPageComponent implements OnInit, OnChanges {
  selectedPlan: any = null;

  step = 1;
  selectedAgent: any = null;
  selectedDate: string = '';
  selectedSlot: any = null;
  details = {
    type: "",
    reason: "",
    plan: "",
    mode: "Call",
    notes: "" // added optional notes
  };
  isConfirming = false;
  successInfo: { id: any } | null = null;

  slotsByDate: { [key: string]: any[] } = {};
  slotError = "";
  loadingSlots = false;
  openSlots: any[] = [];

  browseStart: Date = new Date();
  BROWSE_DAYS = 7;

  constructor(
    private schedulingService: AppointmentSchedulingService,
    private router: Router,
    private cdr: ChangeDetectorRef
  ) {
    this.browseStart.setHours(0, 0, 0, 0);

    // Retrieve plan from router state if available
    const nav = this.router.getCurrentNavigation();
    if (nav?.extras?.state?.['plan']) {
      this.selectedPlan = nav.extras.state['plan'];
    } else {
      // Fallback check history directly if page reloaded or nav cleared
      const state = history.state;
      if (state && state.plan) {
        this.selectedPlan = state.plan;
      }
    }
  }

  ngOnInit() {
    this.fetchSlots();
    this.updateDetailsFromPlan();
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['selectedPlan']) {
      this.updateDetailsFromPlan();
    }
  }

  updateDetailsFromPlan() {
    if (this.selectedPlan) {
      this.details = {
        ...this.details,
        plan: this.selectedPlan.name,
        reason: this.details.reason || `Inquiry about ${this.selectedPlan.name}`
      };
    }
  }

  toDateString(d: Date) {
    return d.toISOString().slice(0, 10);
  }

  async fetchSlots() {
    const datesToFetch: string[] = [];
    for (let i = 0; i < this.BROWSE_DAYS; i++) {
      const d = new Date(this.browseStart);
      d.setDate(this.browseStart.getDate() + i);
      datesToFetch.push(this.toDateString(d));
    }

    this.loadingSlots = true;
    this.slotError = "";

    // In a real scenario, executing these sequentially or using forkJoin
    const allSlots: any[] = [];
    const byDate: { [key: string]: any[] } = {};

    try {
      // Using Promise.all to fetch in parallel
      const requests = datesToFetch.map(dateStr =>
        this.schedulingService.getPublicAvailability(dateStr).toPromise()
      );

      const results = await Promise.all(requests);

      results.forEach((list, index) => {
        const dateStr = datesToFetch[index];
        const mapped = (list || []).map((a: any) => ({
          id: a.id,
          date: a.date,
          start: a.startTime,
          end: a.endTime,
          status: a.status,
          notes: a.notes || "",
          agentId: a.agentId,
          agentName: a.agentName,
        }));
        byDate[dateStr] = mapped;
        allSlots.push(...mapped);
      });

      this.slotsByDate = byDate;
      this.openSlots = allSlots;
      this.selectedDate = this.toDateString(this.browseStart);

    } catch (err) {
      console.error("Failed to load public slots", err);
      this.slotError = "Could not load available slots. Please try again.";
    } finally {
      this.loadingSlots = false;
      this.cdr.detectChanges();
    }
  }

  handleGoHome() {
    this.router.navigate(['/']);
  }

  handleSelectSlotFromList(slot: any) {
    this.selectedSlot = slot;
    this.selectedAgent = {
      id: slot.agentId,
      name: slot.agentName,
    };
    this.selectedDate = slot.date;
  }

  handleConfirm() {
    if (!this.selectedSlot || !this.selectedAgent) {
      alert("Missing agent or slot.");
      return;
    }

    this.isConfirming = true;

    const body: ScheduleAppointmentRequest = {
      agentId: this.selectedAgent.id,
      availabilityId: this.selectedSlot.id,
      scheduledAt: null, // As per React code
      reason: this.details.reason,
      notes: this.details.notes || "",
    };

    this.schedulingService.scheduleAppointment(body).subscribe({
      next: (resp) => {
        // remove booked slot from UI
        this.openSlots = this.openSlots.filter((s) => s.id !== this.selectedSlot.id);
        const list = this.slotsByDate[this.selectedSlot.date] || [];
        this.slotsByDate[this.selectedSlot.date] = list.filter((s) => s.id !== this.selectedSlot.id);

        this.successInfo = { id: resp.id };
        this.step = 1;
        this.selectedAgent = null;
        this.selectedDate = '';
        this.selectedSlot = null;
        this.details = { type: "", reason: "", plan: "", mode: "Call", notes: "" };
        this.isConfirming = false;
        this.cdr.detectChanges();
      },
      error: (e) => {
        console.error("Failed to schedule appointment", e);
        alert("Could not schedule appointment. Please try another slot.");
        this.isConfirming = false;
        this.cdr.detectChanges();
      }
    });
  }

  get currentStepTitle(): string {
    return this.step === 1 ? "Choose your specialist"
      : this.step === 2 ? "Pick a date & slot"
        : "Review & confirm";
  }
}
