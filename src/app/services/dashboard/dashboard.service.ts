import api from '../api';
import { ApiResponse } from '../auth/auth.types'; 
import { DashboardOverviewResponse } from './dashboard.types';

export const dashboardService = {
    getOverview: (period: 'MONTH' | 'YEAR' = 'YEAR') => 
        api.get<ApiResponse<DashboardOverviewResponse>>(`/api/v1/dashboard/overview?period=${period}`)
           .then(res => res.data)
};