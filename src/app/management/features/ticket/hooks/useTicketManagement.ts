import { useState, useEffect } from "react";
import { ticketService } from "../../../../services/ticket/ticket.service";
import { SupportTicketResponse, TicketStatus, } from "../../../../services/ticket/ticket.type";

export const useTicketManagement = () => {
  const [tickets, setTickets] = useState<SupportTicketResponse[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("ALL");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 8;

  const fetchTickets = async () => {
    setIsLoading(true);
    try {
      const res = await ticketService.getAllTicketsForAdmin();
      setTickets(res.result || []);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => { fetchTickets(); }, []);

  const filteredTickets = tickets.filter(t => {
    const matchSearch = t.subject.toLowerCase().includes(searchTerm.toLowerCase()) || t.id.toString().includes(searchTerm);
    const matchStatus = statusFilter === "ALL" || t.status === statusFilter;
    return matchSearch && matchStatus;
  });

  const paginatedTickets = filteredTickets.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);
  const totalPages = Math.ceil(filteredTickets.length / itemsPerPage);

  return {
    tickets,
    isLoading,
    searchTerm,
    setSearchTerm,
    statusFilter,
    setStatusFilter,
    currentPage,
    setCurrentPage,
    paginatedTickets,
    totalPages,
    refreshTickets: fetchTickets,
    stats: {
        open: tickets.filter(t => t.status === 'OPEN').length,
        processing: tickets.filter(t => t.status === 'PROCESSING').length,
        closed: tickets.filter(t => t.status === 'RESOLVED' || t.status === 'CLOSED').length
    }
  };
};