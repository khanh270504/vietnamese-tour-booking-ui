import { useState, useEffect, useRef } from "react";
import { MessageCircle, X, Send } from "lucide-react";

interface Message {
  id: string;
  text: string;
  sender: "user" | "staff";
  time: string;
  userId?: string;
  userName?: string;
}

export function ChatSupport() {
  const [isOpen, setIsOpen] = useState(false);
  const [inputMessage, setInputMessage] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);
  
  const currentUser = JSON.parse(localStorage.getItem("currentUser") || "{}");
  const userId = currentUser.id || "guest";
  const userName = currentUser.name || "Khách";
  
  const [messages, setMessages] = useState<Message[]>(() => {
    const savedMessages = localStorage.getItem(`chat_${userId}`);
    if (savedMessages) return JSON.parse(savedMessages);
    return [
      {
        id: "1",
        text: "Xin chào! Tôi có thể giúp gì cho bạn?",
        sender: "staff",
        time: new Date().toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' })
      }
    ];
  });

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    localStorage.setItem(`chat_${userId}`, JSON.stringify(messages));
  }, [messages, userId]);

  const handleSend = () => {
    if (!inputMessage.trim()) return;

    const newMessage: Message = {
      id: Date.now().toString(),
      text: inputMessage,
      sender: "user",
      time: new Date().toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' }),
      userId: userId,
      userName: userName
    };

    setMessages([...messages, newMessage]);
    setInputMessage("");

    setTimeout(() => {
      setMessages(prev => [...prev, {
        id: (Date.now() + 1).toString(),
        text: "Cảm ơn bạn đã liên hệ. Nhân viên sẽ phản hồi trong giây lát.",
        sender: "staff",
        time: new Date().toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' })
      }]);
    }, 1000);
  };

  return (
    <>
      {/* Nút bong bóng chat thuần HTML */}
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="fixed bottom-6 right-6 w-14 h-14 rounded-full shadow-lg flex items-center justify-center z-50 hover:scale-110 transition-transform bg-[#2563eb] text-white"
        >
          <MessageCircle className="w-6 h-6" />
        </button>
      )}

      {/* Cửa sổ Chat */}
      {isOpen && (
        <div className="fixed bottom-6 right-6 w-80 sm:w-96 h-[500px] bg-white rounded-2xl shadow-2xl z-50 flex flex-col border border-gray-200 overflow-hidden animate-in slide-in-from-bottom-5 duration-300">
          
          {/* Header */}
          <div className="flex items-center justify-between p-4 bg-[#2563eb] text-white">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
              <h3 className="font-semibold">Hỗ trợ khách hàng</h3>
            </div>
            <button onClick={() => setIsOpen(false)} className="hover:bg-white/20 rounded-full p-1">
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Nội dung tin nhắn */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-[80%] rounded-2xl p-3 shadow-sm ${
                    message.sender === 'user'
                      ? 'bg-[#2563eb] text-white rounded-tr-none'
                      : 'bg-white text-gray-900 rounded-tl-none border border-gray-100'
                  }`}
                >
                  <p className="text-sm">{message.text}</p>
                  <p className={`text-[10px] mt-1 opacity-70 ${
                    message.sender === 'user' ? 'text-right' : 'text-left'
                  }`}>
                    {message.time}
                  </p>
                </div>
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>

          {/* Input nhập liệu thuần HTML */}
          <div className="p-4 bg-white border-t">
            <div className="flex gap-2 bg-gray-100 rounded-full px-4 py-2 items-center focus-within:ring-2 focus-within:ring-[#2563eb] transition-all">
              <input
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleSend()}
                placeholder="Nhập nội dung..."
                className="flex-1 bg-transparent border-none outline-none text-sm py-1"
              />
              <button
                onClick={handleSend}
                disabled={!inputMessage.trim()}
                className="text-[#2563eb] hover:scale-110 transition-transform disabled:text-gray-400"
              >
                <Send className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}