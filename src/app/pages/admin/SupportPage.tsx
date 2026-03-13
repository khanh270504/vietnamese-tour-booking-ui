import { useState, useEffect, useRef } from "react";
import { Link } from "react-router";
import { ArrowLeft, Send, User, Search } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "../../components/ui/card";
import { Button } from "../../components/ui/button";
import { Input } from "../../components/ui/input";
import { Badge } from "../../components/ui/badge";
import { ScrollArea } from "../../components/ui/scroll-area";

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
    // Load all chat sessions from localStorage
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
  }, [selectedChat]);

  const handleSendReply = () => {
    if (!replyMessage.trim() || !selectedChat) return;

    const newMessage: Message = {
      id: Date.now().toString(),
      text: replyMessage,
      sender: "staff",
      time: new Date().toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' })
    };

    const updatedMessages = [...selectedChat.messages, newMessage];
    
    // Update localStorage
    localStorage.setItem(`chat_${selectedChat.userId}`, JSON.stringify(updatedMessages));

    // Update state
    setSelectedChat({
      ...selectedChat,
      messages: updatedMessages,
      lastMessage: newMessage.text,
      lastMessageTime: newMessage.time
    });

    setChatSessions(prev => 
      prev.map(session => 
        session.userId === selectedChat.userId 
          ? { ...session, messages: updatedMessages, lastMessage: newMessage.text, lastMessageTime: newMessage.time }
          : session
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
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b shadow-sm">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Link to="/admin">
                <Button variant="outline" size="icon">
                  <ArrowLeft className="w-4 h-4" />
                </Button>
              </Link>
              <div>
                <h1 className="text-3xl font-bold" style={{ color: '#2563eb' }}>
                  Hỗ Trợ Khách Hàng
                </h1>
                <p className="text-gray-600 mt-1">
                  {totalUnread} tin nhắn chưa đọc
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-[calc(100vh-200px)]">
          {/* Chat List */}
          <Card className="lg:col-span-1">
            <CardHeader>
              <CardTitle className="text-lg">Danh sách chat</CardTitle>
              <div className="relative mt-2">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <Input
                  placeholder="Tìm kiếm..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-9 h-9"
                />
              </div>
            </CardHeader>
            <CardContent className="p-0">
              <ScrollArea className="h-[calc(100vh-360px)]">
                <div className="divide-y">
                  {filteredSessions.map((session) => (
                    <div
                      key={session.userId}
                      onClick={() => setSelectedChat(session)}
                      className={`p-4 cursor-pointer hover:bg-gray-50 transition-colors ${
                        selectedChat?.userId === session.userId ? "bg-blue-50" : ""
                      }`}
                    >
                      <div className="flex items-start gap-3">
                        <div className="w-10 h-10 rounded-full bg-[#2563eb] text-white flex items-center justify-center flex-shrink-0">
                          <User className="w-5 h-5" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between mb-1">
                            <p className="font-medium text-sm truncate">{session.userName}</p>
                            <span className="text-xs text-gray-500">{session.lastMessageTime}</span>
                          </div>
                          <p className="text-xs text-gray-600 truncate">{session.lastMessage}</p>
                        </div>
                        {session.unreadCount > 0 && (
                          <Badge className="bg-red-600 h-5 min-w-5 flex items-center justify-center text-xs">
                            {session.unreadCount}
                          </Badge>
                        )}
                      </div>
                    </div>
                  ))}
                  {filteredSessions.length === 0 && (
                    <div className="p-8 text-center text-gray-500 text-sm">
                      Không có cuộc trò chuyện nào
                    </div>
                  )}
                </div>
              </ScrollArea>
            </CardContent>
          </Card>

          {/* Chat Window */}
          <Card className="lg:col-span-2">
            {selectedChat ? (
              <>
                <CardHeader className="border-b">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-[#2563eb] text-white flex items-center justify-center">
                      <User className="w-5 h-5" />
                    </div>
                    <div>
                      <CardTitle className="text-lg">{selectedChat.userName}</CardTitle>
                      <p className="text-xs text-gray-500">ID: {selectedChat.userId}</p>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="p-0 flex flex-col h-[calc(100vh-360px)]">
                  {/* Messages */}
                  <ScrollArea className="flex-1 p-4">
                    <div className="space-y-4">
                      {selectedChat.messages.map((message) => (
                        <div
                          key={message.id}
                          className={`flex ${message.sender === 'staff' ? 'justify-end' : 'justify-start'}`}
                        >
                          <div
                            className={`max-w-[70%] rounded-lg p-3 ${
                              message.sender === 'staff'
                                ? 'bg-[#2563eb] text-white'
                                : 'bg-gray-100 text-gray-900'
                            }`}
                          >
                            <p className="text-sm">{message.text}</p>
                            <p className={`text-xs mt-1 ${
                              message.sender === 'staff' ? 'text-blue-100' : 'text-gray-500'
                            }`}>
                              {message.time}
                            </p>
                          </div>
                        </div>
                      ))}
                      <div ref={messagesEndRef} />
                    </div>
                  </ScrollArea>

                  {/* Reply Input */}
                  <div className="p-4 border-t">
                    <div className="flex gap-2">
                      <Input
                        value={replyMessage}
                        onChange={(e) => setReplyMessage(e.target.value)}
                        onKeyPress={(e) => e.key === 'Enter' && handleSendReply()}
                        placeholder="Nhập phản hồi..."
                        className="flex-1"
                      />
                      <Button
                        onClick={handleSendReply}
                        className="bg-[#2563eb] hover:bg-[#1d4ed8]"
                      >
                        <Send className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </>
            ) : (
              <CardContent className="p-12 text-center">
                <div className="text-gray-400">
                  <User className="w-16 h-16 mx-auto mb-4" />
                  <p className="text-lg">Chọn một cuộc trò chuyện để bắt đầu</p>
                </div>
              </CardContent>
            )}
          </Card>
        </div>
      </div>
    </div>
  );
}
