export interface DepartmentRequest {
    departmentId?: string;
    name: string;
    description?: string;
}

export interface DepartmentResponse {
    departmentId: string;
    name: string;
    description?: string;
}

export interface StaffCreateRequest {
    email: string;
    password?: string;
    fullName: string;
    roleName: string;  
    departmentId?: string;
    position?: string; 
    employeeCode?: string;
    phone?: string;
}

export interface StaffUpdateRequest {
    fullName?: string;
    phone?: string;
    departmentId?: string;
    hireDate?: string;  
    position?: string;
    status?: string;    
}

export interface StaffProfileResponse {
    staffId: number;       
    employeeCode: string;
    fullName: string;
    phone: string;
    departmentName: string;
    position: string;
    hireDate: string;   
    status: string;     
}