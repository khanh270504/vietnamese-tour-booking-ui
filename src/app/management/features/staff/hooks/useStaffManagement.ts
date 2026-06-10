import { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import { staffService } from '../../../../services/staff/staff.service'; // Chỉnh đường dẫn cho đúng
import { 
    StaffProfileResponse, 
    DepartmentResponse, 
    StaffCreateRequest, 
    StaffUpdateRequest 
} from '../../../../services/staff/staff.types';

export const useStaffManagement = () => {
    const [staffs, setStaffs] = useState<StaffProfileResponse[]>([]);
    const [departments, setDepartments] = useState<DepartmentResponse[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    const fetchData = async () => {
        setIsLoading(true);
        try {
            // Vẫn lấy cả 2 trong 1 lần cho tiện
            const [staffRes, deptRes] = await Promise.all([
                staffService.getAllStaffs(),
                staffService.getAllDepartments()
            ]);
            setStaffs(staffRes.result || []);
            setDepartments(deptRes.result || []);
        } catch (error) {
            toast.error("Lỗi tải dữ liệu nhân sự");
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => { fetchData(); }, []);

    const createStaff = async (data: StaffCreateRequest) => {
        try {
            await staffService.createStaff(data);
            toast.success("Thêm nhân viên thành công");
            await fetchData(); // Refresh lại list
            return true;
        } catch (err: any) {
            toast.error(err.response?.data?.message || "Lỗi tạo nhân viên");
            return false;
        }
    };

    const updateStaff = async (userId: number, data: StaffUpdateRequest) => {
        try {
            await staffService.updateStaff(userId, data);
            toast.success("Cập nhật thành công");
            await fetchData();
            return true;
        } catch (err: any) {
            toast.error("Lỗi cập nhật nhân viên");
            return false;
        }
    };

    const toggleStaffStatus = async (staffId: number) => {
        try {
            await staffService.toggleStaffStatus(staffId);
            toast.success("Đã thay đổi trạng thái");
            await fetchData();
        } catch {
            toast.error("Lỗi thay đổi trạng thái");
        }
    };

    return { 
        staffs, 
        departments, 
        isLoading, 
        refresh: fetchData,
        createStaff,
        updateStaff,
        toggleStaffStatus
    };
};