package com.example.InsurAI.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@AllArgsConstructor
public class AdminDashboardSummary {

    private long totalAppointmentsToday;
    private long totalAppointmentsLast7Days;
    private long totalAppointmentsAllTime;

    private long totalActiveCustomers;
    private long totalActiveAgents;
    private long totalActivePlans;
}
