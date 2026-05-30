import { useEffect, useState, useRef } from "react";
import SockJS from "sockjs-client";
import { Client, StompSubscription } from "@stomp/stompjs";
import { Search, Send, User, Headset, Clock, MessageCircle, MoreVertical, Phone } from "lucide-react";
import { cn } from "../../lib/utils";
import api from "../../services/api";

interface Message {
  id: string;
  conversationId: string;
  senderId?: number;
  senderRole: "CUSTOMER" | "STAFF" | "ADMIN" | "GUEST" | "BOT";
  content: string;
  createdAt: string;
  guestId?: string;
}

interface ChatRoom {
  conversationId: string;
  guestName: string;
  lastMessage: string;
  updatedAt: string;
  unreadCount?: number;
}

export default function AdminChat() {
  const [rooms, setRooms] = useState<ChatRoom[]>([]);
  const [searchQuery, setSearchQuery] = useState(""); // State cho ô tìm kiếm
  const [activeRoom, setActiveRoom] = useState<string | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [text, setText] = useState("");
  
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const stompClientRef = useRef<Client | null>(null);
  const roomSubscriptionRef = useRef<StompSubscription | null>(null);

  // =========================
  // 1. LẤY DANH SÁCH PHÒNG CHAT (Lúc mới vào)
  // =========================
  useEffect(() => {
    const fetchRooms = async () => {
      try {
        const res = await api.get("/api/v1/chat/rooms");
        setRooms(res.data.result || res.data);
      } catch (err) {
        console.error("Lỗi lấy danh sách phòng chat:", err);
      }
    };
    fetchRooms();
  }, []);

  // =========================
  // 2. KHỞI TẠO ĐÚNG 1 KẾT NỐI SOCKET DUY NHẤT (GLOBAL)
  // =========================
  useEffect(() => {
    const socket = new SockJS("http://localhost:8080/ws");
    const client = new Client({
      webSocketFactory: () => socket,
      reconnectDelay: 5000,
    });

    client.onConnect = () => {
      console.log("📡 TỔNG ĐÀI ĐÃ KẾT NỐI SOCKET");
      
      // Lắng nghe có tin nhắn mới thì đẩy phòng chat đó lên đầu
      client.subscribe(`/topic/admin/chat/notify`, (message) => {
        const newMessage: Message = JSON.parse(message.body);
        
        setRooms((prevRooms) => {
          const existingRoomIndex = prevRooms.findIndex(r => r.conversationId === newMessage.conversationId);
          let updatedRoom: ChatRoom;
          
          if (existingRoomIndex !== -1) {
            updatedRoom = { ...prevRooms[existingRoomIndex], lastMessage: newMessage.content, updatedAt: newMessage.createdAt };
            const newRooms = [...prevRooms];
            newRooms.splice(existingRoomIndex, 1);
            return [updatedRoom, ...newRooms];
          } else {
            let shortName = newMessage.conversationId.startsWith("customer_") 
              ? `Thành viên #${newMessage.conversationId.replace("customer_", "")}` 
              : `Khách #${newMessage.guestId?.replace("guest_", "").substring(0,8).toUpperCase() || "Vãng lai"}`;
            
            updatedRoom = { conversationId: newMessage.conversationId, guestName: shortName, lastMessage: newMessage.content, updatedAt: newMessage.createdAt };
            return [updatedRoom, ...prevRooms];
          }
        });
      });
    };

    client.activate();
    stompClientRef.current = client;

    return () => {
      client.deactivate();
    };
  }, []);

  // =========================
  // 3. ĐỔI PHÒNG CHAT -> LOAD TIN CŨ & SUBSCRIBE PHÒNG ĐÓ
  // =========================
  useEffect(() => {
    if (!activeRoom || !stompClientRef.current?.connected) return;

    // Hủy lắng nghe phòng cũ (nếu có) để tránh lặp tin nhắn
    if (roomSubscriptionRef.current) {
      roomSubscriptionRef.current.unsubscribe();
    }

    const loadMessages = async () => {
      try {
        const res = await api.get(`/api/v1/chat/${activeRoom}`);
        setMessages(res.data.result || res.data);
      } catch (err) {
        console.error("Lỗi load tin nhắn cũ:", err);
      }
    };
    loadMessages();

    // Lắng nghe phòng mới
    console.log("🟢 ADMIN ĐÃ VÀO PHÒNG:", activeRoom);
    roomSubscriptionRef.current = stompClientRef.current.subscribe(`/topic/chat/${activeRoom}`, (message) => {
      const body = JSON.parse(message.body);
      setMessages((prev) => {
        if (prev.some((m) => m.id === body.id)) return prev;
        return [...prev, body];
      });
    });

  }, [activeRoom]);

  // Cuộn xuống cuối mỗi khi có tin nhắn mới
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // =========================
  // 4. ADMIN GỬI TIN NHẮN
  // =========================
  const send = async () => {
    if (!text.trim() || !activeRoom) return;

    const guestIdExtracted = activeRoom.replace("room_", "");
    const payload = {
      conversationId: activeRoom,
      content: text,
      guestId: activeRoom.includes("guest_") ? guestIdExtracted : null 
    };

    try {
      await api.post("/api/v1/chat", payload);
      setText("");
    } catch (error) {
      console.error("Gửi tin nhắn lỗi:", error);
    }
  };

  // Logic lọc phòng chat theo tìm kiếm
  const filteredRooms = rooms.filter(r => r.guestName.toLowerCase().includes(searchQuery.toLowerCase()));

  return (
    <div className="flex h-[calc(100vh-10rem)] bg-white rounded-[2.5rem] shadow-sm border border-slate-100 overflow-hidden font-sans text-slate-800 animate-in fade-in">
      
      {/* 🟢 CỘT TRÁI: DANH SÁCH PHÒNG CHAT */}
      <div className="w-[380px] border-r border-slate-100 flex flex-col bg-slate-50/50">
        <div className="p-6 bg-white border-b border-slate-100">
          <h2 className="text-xl font-black text-slate-900 flex items-center gap-3">
            <div className="w-10 h-10 bg-blue-100 text-blue-600 rounded-xl flex items-center justify-center"><Headset size={20} /></div>
            CSKH Chat
          </h2>
          <div className="mt-6 relative group">
            <input 
              type="text" 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Tìm kiếm khách hàng..." 
              className="w-full pl-11 pr-4 py-3 bg-slate-50 border-transparent rounded-2xl text-xs font-bold outline-none focus:bg-white focus:border-blue-200 border transition-all"
            />
            <Search className="w-4 h-4 text-slate-400 absolute left-4 top-1/2 -translate-y-1/2 group-focus-within:text-blue-500 transition-colors" />
          </div>
        </div>

        <div className="flex-1 overflow-y-auto custom-scrollbar p-3 space-y-2">
          {filteredRooms.length === 0 ? (
             <p className="text-center text-xs font-bold text-slate-400 mt-10 uppercase">Không tìm thấy khách</p>
          ) : (
            filteredRooms.map((room) => (
              <button
                key={room.conversationId}
                onClick={() => setActiveRoom(room.conversationId)}
                className={cn(
                  "w-full text-left p-4 rounded-2xl transition-all duration-200 group border",
                  activeRoom === room.conversationId 
                    ? "bg-white border-blue-100 shadow-[0_8px_30px_rgb(37,99,235,0.08)]" 
                    : "bg-transparent border-transparent hover:bg-white hover:shadow-sm"
                )}
              >
                <div className="flex justify-between items-start mb-1.5">
                  <span className={cn("font-black text-sm truncate pr-2", activeRoom === room.conversationId ? "text-blue-600" : "text-slate-800 group-hover:text-blue-600")}>
                    {room.guestName}
                  </span>
                  <span className="text-[10px] font-bold text-slate-400 whitespace-nowrap">
                    {new Date(room.updatedAt).toLocaleTimeString("vi-VN", { hour: "2-digit", minute: "2-digit" })}
                  </span>
                </div>
                <p className="text-xs font-medium text-slate-500 truncate">{room.lastMessage}</p>
              </button>
            ))
          )}
        </div>
      </div>

      {/* 🟢 CỘT PHẢI: KHUNG CHAT CHI TIẾT */}
      <div className="flex-1 flex flex-col bg-slate-50/30">
        {activeRoom ? (
          <>
            <div className="px-8 py-5 border-b border-slate-100 bg-white flex justify-between items-center shadow-sm z-10 shrink-0">
              <div className="flex items-center gap-4">
                <div className="relative">
                  <div className="w-12 h-12 rounded-2xl bg-blue-50 flex items-center justify-center text-blue-600 shadow-inner">
                    <User size={24} />
                  </div>
                  <span className="absolute -bottom-1 -right-1 w-4 h-4 rounded-full bg-emerald-500 border-2 border-white animate-pulse"></span>
                </div>
                <div>
                  <h3 className="font-black text-slate-900 text-lg">{rooms.find(r => r.conversationId === activeRoom)?.guestName || activeRoom}</h3>
                  <p className="text-[10px] font-bold text-emerald-500 uppercase tracking-widest mt-0.5">Đang trực tuyến</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                 <button className="p-3 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-xl transition-all"><Phone size={20} /></button>
                 <button className="p-3 text-slate-400 hover:text-slate-900 hover:bg-slate-100 rounded-xl transition-all"><MoreVertical size={20} /></button>
              </div>
            </div>

            <div className="flex-1 overflow-y-auto p-8 space-y-6 custom-scrollbar">
              {messages.map((m, i) => {
                const isAdmin = m.senderRole === "ADMIN" || m.senderRole === "STAFF";
                return (
                  <div key={m.id || i} className={`flex ${isAdmin ? "justify-end" : "justify-start"}`}>
                    <div className={cn(
                      "max-w-[70%] px-5 py-3 shadow-sm",
                      isAdmin 
                        ? "bg-blue-600 text-white rounded-2xl rounded-tr-sm" 
                        : "bg-white text-slate-800 border border-slate-100 rounded-2xl rounded-tl-sm"
                    )}>
                      <div className={cn("text-[10px] mb-1 font-black uppercase tracking-wider", isAdmin ? "text-blue-200" : "text-slate-400")}>
                        {isAdmin ? "Admin" : "Khách hàng"}
                      </div>
                      <div className="text-sm font-medium leading-relaxed">{m.content}</div>
                    </div>
                  </div>
                );
              })}
              <div ref={messagesEndRef} />
            </div>

            <div className="p-6 bg-white border-t border-slate-100 shrink-0">
              <div className="flex gap-3 items-center bg-slate-50 rounded-2xl p-2 border border-slate-200 focus-within:border-blue-400 focus-within:bg-white focus-within:shadow-[0_4px_20px_rgb(37,99,235,0.1)] transition-all">
                <input 
                  type="text" 
                  value={text} 
                  onChange={(e) => setText(e.target.value)} 
                  onKeyDown={(e) => e.key === "Enter" && send()}
                  placeholder="Gõ tin nhắn hỗ trợ khách hàng..." 
                  className="flex-1 bg-transparent px-4 py-3 outline-none text-sm font-semibold text-slate-800 placeholder:text-slate-400"
                />
                <button 
                  onClick={send} 
                  disabled={!text.trim()}
                  className="px-6 py-3.5 bg-blue-600 text-white font-black text-sm rounded-xl hover:bg-blue-700 disabled:bg-slate-300 disabled:cursor-not-allowed transition-all flex items-center gap-2 shadow-lg shadow-blue-200"
                >
                  <Send size={18} /> Gửi tin
                </button>
              </div>
            </div>
          </>
        ) : (
          <div className="flex-1 flex flex-col items-center justify-center text-slate-400 bg-slate-50/30">
            <div className="w-24 h-24 bg-slate-100 rounded-full flex items-center justify-center mb-6">
               <MessageCircle size={40} className="text-slate-300" />
            </div>
            <h3 className="text-xl font-black text-slate-800">Chưa chọn đoạn hội thoại</h3>
            <p className="text-sm font-medium mt-2">Vui lòng chọn một khách hàng ở danh sách bên trái để bắt đầu hỗ trợ</p>
          </div>
        )}
      </div>
    </div>
  );
}