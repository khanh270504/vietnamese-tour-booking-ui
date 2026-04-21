import { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom"; // Sửa lại import cho đúng chuẩn react-router-dom
import { ArrowLeft, Send, User, Search } from "lucide-react";

interface Message {
  id: string;
  text: string;
  sender: "user" | "staff";
  time: string;
  userId?: string;
  userName?: string;
}

interface ChatSession {
  userId: string;
  userName: string;
  lastMessage: string;
  lastMessageTime: string;
  unreadCount: number;
  messages: Message[];
}

export function SupportPage() {
  const [chatSessions, setChatSessions] = useState<ChatSession[]>([]);
  const [selectedChat, setSelectedChat] = useState<ChatSession | null>(null);
  const [replyMessage, setReplyMessage] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const chatKeys = Object.keys(localStorage).filter(key => key.startsWith("chat_"));
    const sessions: ChatSession[] = chatKeys.map((key, index) => {
      const userId = key.replace("chat_", "");
      const messages = JSON.parse(localStorage.getItem(key) || "[]");
      const lastMsg = messages[messages.length - 1];
      
      return {
        userId: userId,
        userName: `Khách hàng ${index + 1}`,
        lastMessage: lastMsg?.text || "Chưa có tin nhắn",
        lastMessageTime: lastMsg?.time || "",
        unreadCount: messages.filter((m: Message) => m.sender === "user").length,
        messages: messages
      };
    });

    setChatSessions(sessions);
  }, []);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [selectedChat?.messages]); // Cuộn khi có tin nhắn mới

  const handleSendReply = () => {
    if (!replyMessage.trim() || !selectedChat) return;

    const newMessage: Message = {
      id: Date.now().toString(),
      text: replyMessage,
      sender: "staff",
      time: new Date().toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' })
    };

    const updatedMessages = [...selectedChat.messages, newMessage];
    localStorage.setItem(`chat_${selectedChat.userId}`, JSON.stringify(updatedMessages));

    const updatedSession = {
      ...selectedChat,
      messages: updatedMessages,
      lastMessage: newMessage.text,
      lastMessageTime: newMessage.time
    };

    setSelectedChat(updatedSession);
    setChatSessions(prev => 
      prev.map(session => 
        session.userId === selectedChat.userId ? updatedSession : session
      )
    );
    setReplyMessage("");
  };

  const filteredSessions = chatSessions.filter(session =>
    session.userName.toLowerCase().includes(searchQuery.toLowerCase()) ||
    session.lastMessage.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const totalUnread = chatSessions.reduce((sum, session) => sum + session.unreadCount, 0);

  return (
    <div className="min-h-screen bg-gray-50 font-sans">
      {/* Header */}
      <header className="bg-white border-b shadow-sm sticky top-0 z-10">
        <div className="container mx-auto px-4 py-4 flex items-center gap-4">
          <Link to="/admin" className="p-2 border rounded-full hover:bg-gray-100 transition-colors">
            <ArrowLeft className="w-5 h-5 text-gray-600" />
          </Link>
          <div>
            <h1 className="text-2xl font-bold text-blue-600">Hỗ Trợ Khách Hàng</h1>
            <p className="text-sm text-gray-500">{totalUnread} tin nhắn mới</p>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-[calc(100vh-160px)]">
          
          {/* Chat List Area */}
          <div className="bg-white border rounded-xl overflow-hidden shadow-sm flex flex-col lg:col-span-1">
            <div className="p-4 border-b">
              <h2 className="font-semibold mb-3">Danh sách chat</h2>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="Tìm kiếm..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>
            <div className="flex-1 overflow-y-auto">
              {filteredSessions.map((session) => (
                <div
                  key={session.userId}
                  onClick={() => setSelectedChat(session)}
                  className={`p-4 cursor-pointer border-b last:border-b-0 hover:bg-gray-50 transition-colors ${
                    selectedChat?.userId === session.userId ? "bg-blue-50 border-l-4 border-l-blue-600" : ""
                  }`}
                >
                  <div className="flex items-start gap-3">
                    <div className="w-10 h-10 rounded-full bg-blue-600 text-white flex items-center justify-center flex-shrink-0">
                      <User className="w-5 h-5" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between mb-1">
                        <p className="font-medium text-sm truncate">{session.userName}</p>
                        <span className="text-[10px] text-gray-400">{session.lastMessageTime}</span>
                      </div>
                      <p className="text-xs text-gray-500 truncate">{session.lastMessage}</p>
                    </div>
                    {session.unreadCount > 0 && (
                      <span className="bg-red-500 text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full">
                        {session.unreadCount}
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Chat Window Area */}
          <div className="bg-white border rounded-xl overflow-hidden shadow-sm flex flex-col lg:col-span-2">
            {selectedChat ? (
              <>
                <div className="p-4 border-b flex items-center gap-3 bg-white">
                  <div className="w-10 h-10 rounded-full bg-blue-600 text-white flex items-center justify-center">
                    <User className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="font-bold text-sm">{selectedChat.userName}</h3>
                    <span className="text-[10px] text-green-500">Đang trực tuyến</span>
                  </div>
                </div>

                <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50">
                  {selectedChat.messages.map((message) => (
                    <div
                      key={message.id}
                      className={`flex ${message.sender === 'staff' ? 'justify-end' : 'justify-start'}`}
                    >
                      <div
                        className={`max-w-[75%] rounded-2xl px-4 py-2 shadow-sm ${
                          message.sender === 'staff'
                            ? 'bg-blue-600 text-white rounded-tr-none'
                            : 'bg-white text-gray-800 border rounded-tl-none'
                        }`}
                      >
                        <p className="text-sm">{message.text}</p>
                        <p className={`text-[10px] mt-1 text-right ${
                          message.sender === 'staff' ? 'text-blue-100' : 'text-gray-400'
                        }`}>
                          {message.time}
                        </p>
                      </div>
                    </div>
                  ))}
                  <div ref={messagesEndRef} />
                </div>

                <div className="p-4 border-t bg-white">
                  <form 
                    onSubmit={(e) => { e.preventDefault(); handleSendReply(); }} 
                    className="flex gap-2"
                  >
                    <input
                      type="text"
                      value={replyMessage}
                      onChange={(e) => setReplyMessage(e.target.value)}
                      placeholder="Nhập phản hồi..."
                      className="flex-1 border rounded-full px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    <button
                      type="submit"
                      className="bg-blue-600 text-white p-2 rounded-full hover:bg-blue-700 transition-colors"
                    >
                      <Send className="w-5 h-5" />
                    </button>
                  </form>
                </div>
              </>
            ) : (
              <div className="flex-1 flex flex-col items-center justify-center text-gray-400">
                <User className="w-20 h-20 mb-4 opacity-20" />
                <p className="text-sm">Chọn một cuộc trò chuyện từ danh sách để bắt đầu</p>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}