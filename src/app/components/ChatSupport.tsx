import { useState, useEffect, useRef } from "react";
import { MessageCircle, X, Send, Bot, User, Sparkles, Headset } from "lucide-react";
import api from "../services/api";
import SockJS from "sockjs-client";
import { Client } from "@stomp/stompjs";

interface Message {
  id: string;
  conversationId: string;
  senderId?: number;
  senderRole: "CUSTOMER" | "STAFF" | "GUEST" | "BOT"; // 🎯 Thêm role BOT chờ sẵn
  guestId?: string;
  content: string;
  createdAt: string;
}

export function ChatSupport() {
  const [isOpen, setIsOpen] = useState(false);
  const [inputMessage, setInputMessage] = useState("");
  const [messages, setMessages] = useState<Message[]>([]);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const stompClientRef = useRef<Client | null>(null);

  // 🎯 GIAO DIỆN: Chế độ AI (Chuẩn bị cho tương lai)
  const [isAiMode, setIsAiMode] = useState(false); 

  // =========================
  // USER & GUEST ID (Tối ưu chống giật)
  // =========================
  const currentUser = JSON.parse(localStorage.getItem("currentUser") || "{}");
  const isLoggedIn = !!currentUser?.id;

  const [guestId] = useState(() => {
    let id = localStorage.getItem("guest_id");
    if (!id) {
      id = `guest_${crypto.randomUUID()}`;
      localStorage.setItem("guest_id", id);
    }
    return id;
  });

  const conversationId = isLoggedIn ? `customer_${currentUser.id}` : `guest_${guestId}`;

  // =========================
  // SCROLL
  // =========================
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // =========================
  // LOAD & WEBSOCKET CONNECT
  // =========================
  useEffect(() => {
    if (!isOpen) return;

    const loadMessages = async () => {
      try {
        const res = await api.get(`/api/v1/chat/${conversationId}`);
        const data = res.data.result || res.data;
        setMessages(data);
      } catch (err) {
        console.error("Load messages error:", err);
      }
    };

    loadMessages();
    const socket = new SockJS("http://localhost:8080/ws");
    const stompClient = new Client({
      webSocketFactory: () => socket,
      reconnectDelay: 5000,
      debug: (str) => console.log("STOMP:", str),
    });

    stompClient.onConnect = () => {
      stompClient.subscribe(`/topic/chat/${conversationId}`, (message) => {
        const body = JSON.parse(message.body);
        setMessages((prev) => {
          if (prev.some((m) => m.id === body.id)) return prev;
          return [...prev, body];
        });
      });
    };

    stompClient.activate();
    stompClientRef.current = stompClient;

    return () => stompClient.deactivate();
  }, [isOpen, conversationId]);

  // =========================
  // SEND MESSAGE (HTTP POST)
  // =========================
  const handleSend = async () => {
    if (!inputMessage.trim()) return;

    // 🎯 Sau này sếp nối AI thì check if (isAiMode) gọi api.post("/api/v1/bot/chat") nhé
    const payload = {
      conversationId,
      content: inputMessage,
      guestId: !isLoggedIn ? guestId : null,
    };

    try {
      await api.post("/api/v1/chat", payload); // Gửi API lưu DB chuẩn chỉ
      setInputMessage("");
    } catch (error) {
      console.error("❌ Lỗi gửi tin nhắn:", error);
    }
  };

  return (
    <>
      {/* FLOAT BUTTON */}
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="fixed bottom-6 right-6 w-14 h-14 rounded-full shadow-2xl flex items-center justify-center z-50 hover:scale-110 hover:rotate-12 transition-all duration-300 bg-gradient-to-r from-blue-600 to-blue-500 text-white border-2 border-white"
        >
          <MessageCircle className="w-6 h-6" />
          {/* Chấm đỏ thông báo giả lập */}
          <span className="absolute top-0 right-0 w-3.5 h-3.5 bg-red-500 border-2 border-white rounded-full"></span>
        </button>
      )}

      {/* CHAT BOX */}
      {isOpen && (
        <div className="fixed bottom-6 right-6 w-[360px] sm:w-[400px] h-[550px] bg-white rounded-2xl shadow-[0_20px_50px_-12px_rgba(0,0,0,0.25)] z-50 flex flex-col border border-gray-100 overflow-hidden animate-in slide-in-from-bottom-10 fade-in duration-300">
          
          {/* HEADER (Làm đẹp & Tích hợp Switcher AI) */}
          <div className="bg-gradient-to-r from-blue-600 to-blue-700 p-4 shrink-0">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-3">
                <div className="relative">
                  <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center backdrop-blur-sm border border-white/30">
                    {isAiMode ? <Bot className="w-5 h-5 text-white" /> : <Headset className="w-5 h-5 text-white" />}
                  </div>
                  <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-400 rounded-full border-2 border-blue-700"></div>
                </div>
                <div>
                  <h3 className="font-bold text-white leading-tight">
                    {isAiMode ? "Trợ lý AI Thông minh" : "CSKH Trực tuyến"}
                  </h3>
                  <p className="text-blue-100 text-xs">
                    {isAiMode ? "Phản hồi tức thì ⚡" : "Chúng tôi online 24/7"}
                  </p>
                </div>
              </div>
              <button
                onClick={() => setIsOpen(false)}
                className="w-8 h-8 flex items-center justify-center hover:bg-white/20 rounded-full text-white transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* AI Toggle Button */}
            <div className="bg-white/10 p-1 rounded-lg flex text-xs font-medium backdrop-blur-md border border-white/20">
              <button
                onClick={() => setIsAiMode(false)}
                className={`flex-1 py-1.5 rounded-md transition-all flex items-center justify-center gap-1.5 ${!isAiMode ? 'bg-white text-blue-700 shadow-sm' : 'text-white hover:bg-white/10'}`}
              >
                <Headset className="w-3.5 h-3.5" /> Nhân viên
              </button>
              <button
                onClick={() => setIsAiMode(true)}
                className={`flex-1 py-1.5 rounded-md transition-all flex items-center justify-center gap-1.5 ${isAiMode ? 'bg-white text-blue-700 shadow-sm' : 'text-white hover:bg-white/10'}`}
              >
                <Sparkles className="w-3.5 h-3.5" /> AI Chatbot
              </button>
            </div>
          </div>

          {/* MESSAGES */}
          <div className="flex-1 overflow-y-auto p-4 space-y-5 bg-[#f8fafc]">
            {/* Tin nhắn chào mừng giả lập */}
            <div className="flex justify-center">
              <span className="text-[10px] uppercase font-bold text-gray-400 tracking-wider bg-gray-100 px-3 py-1 rounded-full">
                Bắt đầu cuộc trò chuyện
              </span>
            </div>

            {messages.map((message, index) => {
              const isMine = message.senderRole === "CUSTOMER" || message.senderRole === "GUEST";
              const isBot = message.senderRole === "BOT"; // Sẵn sàng cho Role BOT sau này

              return (
                <div key={message.id || index} className={`flex gap-2 ${isMine ? "flex-row-reverse" : "flex-row"}`}>
                  
                  {/* Avatar */}
                  {!isMine && (
                    <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center shrink-0 border border-blue-200">
                      {isBot ? <Bot className="w-4 h-4 text-blue-600" /> : <Headset className="w-4 h-4 text-blue-600" />}
                    </div>
                  )}
                  {isMine && (
                    <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center shrink-0">
                      <User className="w-4 h-4 text-gray-500" />
                    </div>
                  )}

                  {/* Bubble */}
                  <div className={`flex flex-col ${isMine ? "items-end" : "items-start"} max-w-[75%]`}>
                    <div
                      className={`px-4 py-2.5 rounded-2xl shadow-sm text-sm leading-relaxed ${
                        isMine
                          ? "bg-blue-600 text-white rounded-tr-sm"
                          : "bg-white text-gray-800 rounded-tl-sm border border-gray-100"
                      }`}
                    >
                      {message.content}
                    </div>
                    <span className="text-[10px] text-gray-400 mt-1 font-medium px-1">
                      {new Date(message.createdAt).toLocaleTimeString("vi-VN", { hour: "2-digit", minute: "2-digit" })}
                    </span>
                  </div>
                </div>
              );
            })}
            <div ref={messagesEndRef} />
          </div>

          {/* INPUT */}
          <div className="p-3 bg-white border-t border-gray-100 shrink-0">
            <div className="flex gap-2 bg-[#f1f5f9] rounded-2xl p-1.5 items-end border border-gray-200 focus-within:border-blue-400 focus-within:bg-white transition-colors shadow-inner">
              <textarea
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && !e.shiftKey) {
                    e.preventDefault();
                    handleSend();
                  }
                }}
                placeholder={isAiMode ? "Hỏi AI về tour..." : "Nhập tin nhắn..."}
                className="flex-1 max-h-24 bg-transparent outline-none text-sm resize-none py-2 px-3 text-gray-700 placeholder-gray-400"
                rows={1}
                style={{ minHeight: "40px" }}
              />
              <button
                onClick={handleSend}
                disabled={!inputMessage.trim()}
                className="w-10 h-10 mb-0.5 rounded-xl bg-blue-600 flex items-center justify-center text-white shrink-0 hover:bg-blue-700 transition-colors disabled:bg-gray-300 disabled:cursor-not-allowed shadow-md"
              >
                <Send className="w-4 h-4 ml-0.5" />
              </button>
            </div>
            <div className="text-center mt-2">
              <p className="text-[9px] text-gray-400">Được bảo mật & mã hóa đầu cuối</p>
            </div>
          </div>
        </div>
      )}
    </>
  );
}