// src/services/dashboard/dashboard.types.ts

export interface TopStats {
    totalRevenue: string;
    revenueChange: string;
    winRate: string;
    winRateChange: string;
    newLeads: number;
    leadsChange: string;
    pendingTasks: number;
    overdueTasks: number;
}

export interface RevenueChartData {
    month: string;
    revenue: number;
    cost: number;
}

export interface DestinationData {
    name: string;
    bookings: number;
    color: string;
}

export interface StatusData {
    name: string;
    value: number;
    color: string;
}

export interface FunnelData {
    stage: string;
    count: number;
    conversion: string;
    color: string;
}

export interface SourceData {
    name: string;
    value: number;
    color: string;
}

export interface SalesLeaderboard {
    name: string;
    revenue: string;
    deals: number;
    target: number;
    avatar: string;
}

export interface TaskAlert {
    text: string;
    staff: string;
    delay: string;
    isUrgent: boolean;
}

export interface DashboardOverviewResponse {
    topStats: TopStats;
    revenueData: RevenueChartData[];
    destinationData: DestinationData[];
    statusData: StatusData[];
    funnelData: FunnelData[];
    sourceData: SourceData[];
    salesLeaderboard: SalesLeaderboard[];
    urgentTasks: TaskAlert[];
}