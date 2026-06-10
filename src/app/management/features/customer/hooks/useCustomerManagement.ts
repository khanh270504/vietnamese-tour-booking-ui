import { useState, useEffect, useCallback } from 'react';
import { customerService } from '../../../../services/customer/customer.service';
import { toast } from 'react-toastify';

export const useCustomerManagement = () => {
    const [customers, setCustomers] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [pagination, setPagination] = useState({ page: 1, totalPages: 1, totalItems: 0 });
    
    const [keyword, setKeyword] = useState("");
    const [debouncedKeyword, setDebouncedKeyword] = useState("");

    // 1. Debounce logic
    useEffect(() => {
        const handler = setTimeout(() => {
            setDebouncedKeyword(keyword);
            setPagination(prev => ({ ...prev, page: 1 })); // Reset trang khi gõ
        }, 500);
        return () => clearTimeout(handler);
    }, [keyword]);

    // 2. Fetch dữ liệu trung tâm
    const fetchData = useCallback(async (page: number, search: string) => {
        setIsLoading(true);
        try {
            // Encode keyword ở đây để tránh lỗi URL
            const res = await customerService.getAllCustomers(page, 10, encodeURIComponent(search));
            
            if (res?.result) {
                setCustomers(res.result.content || []);
                setPagination(prev => ({ 
                    ...prev,
                    page: (res.result.number || 0) + 1, 
                    totalPages: res.result.totalPages || 1,
                    totalItems: res.result.totalElements || 0
                }));
            }
        } catch (error) {
            toast.error("Lỗi tải danh sách khách hàng");
            console.error(error);
        } finally {
            setIsLoading(false);
        }
    }, []);

    // 3. Chỉ gọi lại khi debouncedKeyword hoặc page thay đổi
    useEffect(() => { 
        fetchData(pagination.page, debouncedKeyword); 
    }, [pagination.page, debouncedKeyword, fetchData]);

    return { 
        customers, 
        isLoading, 
        pagination, 
        setPage: (p: number) => setPagination(prev => ({...prev, page: p})),
        setKeyword, 
        refresh: () => fetchData(pagination.page, debouncedKeyword) 
    };
};