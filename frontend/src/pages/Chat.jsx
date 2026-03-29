import { useState, useEffect, useContext, useRef } from 'react';
import { useSearchParams } from 'react-router-dom';
import api from '../utils/api';
import { AuthContext } from '../context/AuthContext';
import { io } from 'socket.io-client';
import { Send, User as UserIcon, MessageCircle } from 'lucide-react';

export default function Chat() {
  const { user } = useContext(AuthContext);
  const [searchParams] = useSearchParams();
  const initialUserId = searchParams.get('userId');
  
  const [conversations, setConversations] = useState([]);
  const [activeUser, setActiveUser] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  
  const socketRef = useRef();
  const messagesEndRef = useRef(null);

  useEffect(() => {
    socketRef.current = io('http://localhost:5000');
    
    // Connect user to their personal room to receive messages
    if (user) {
      socketRef.current.emit('join_room', user._id || user.id);
    }

    // Listen for incoming messages
    socketRef.current.on('receive_message', (data) => {
      // Check if this message is for the currently active conversation
      if (activeUser && (data.sender === activeUser._id || data.receiver === activeUser._id)) {
        setMessages((prev) => [...prev, data.message]);
      }
      // You should updateconversations list here in real application
    });

    return () => socketRef.current.disconnect();
  }, [user, activeUser]);

  useEffect(() => {
    // Fetch conversations list
    const fetchConversations = async () => {
      try {
        const res = await api.get('/messages/conversations/me');
        setConversations(res.data);
        
        // If query param exists, setup that active chat
        if (initialUserId) {
          // Check if it's already in conversations
          const existing = res.data.find(c => c.user._id === initialUserId);
          if (existing) {
            setActiveUser(existing.user);
          } else {
            // Need to fetch user details (simplified here, assuming we had a user endpoint)
            setActiveUser({ _id: initialUserId, username: "Seller" });
          }
        } else if (res.data.length > 0) {
          setActiveUser(res.data[0].user);
        }
      } catch (err) {
        console.error(err);
      }
    };
    
    if (user) fetchConversations();
  }, [user, initialUserId]);

  useEffect(() => {
    // Fetch individual chat history
    const fetchMessages = async () => {
      if (!activeUser) return;
      try {
        const res = await api.get(`/messages/${activeUser._id}`);
        setMessages(res.data);
      } catch (err) {
        console.error(err);
      }
    };
    
    if (activeUser) fetchMessages();
  }, [activeUser]);

  useEffect(() => {
    // auto scroll to bottom
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!newMessage.trim() || !activeUser) return;

    try {
      const res = await api.post('/messages', {
        receiver: activeUser._id,
        text: newMessage
      });
      
      const sentMsg = res.data;
      setMessages([...messages, sentMsg]);
      setNewMessage('');

      // Emit to server for real-time delivery
      socketRef.current.emit('send_message', {
        roomId: activeUser._id,
        message: sentMsg,
        sender: user._id || user.id,
        receiver: activeUser._id
      });
    } catch (err) {
      console.error(err);
    }
  };

  if (!user) return <div className="text-center py-20">Please log in to view messages.</div>;

  return (
    <div className="max-w-7xl mx-auto py-6 px-4 h-[85vh] flex">
      <div className="bg-white rounded-3xl shadow-xl w-full flex overflow-hidden border border-gray-100">
        
        {/* Sidebar */}
        <div className={`w-full md:w-1/3 border-r border-gray-100 bg-gray-50 flex flex-col ${activeUser ? 'hidden md:flex' : 'flex'}`}>
          <div className="p-6 border-b border-gray-100 bg-white">
            <h2 className="text-2xl font-black text-gray-900">Messages</h2>
          </div>
          <div className="flex-1 overflow-y-auto custom-scrollbar p-3 space-y-2">
            {conversations.length === 0 ? (
              <p className="text-gray-500 text-center mt-10 font-medium">No conversations yet.</p>
            ) : (
              conversations.map((conv) => (
                <div 
                  key={conv.user._id} 
                  onClick={() => setActiveUser(conv.user)}
                  className={`flex items-center gap-4 p-4 rounded-2xl cursor-pointer transition-all ${activeUser?._id === conv.user._id ? 'bg-primary-50 border border-primary-100 shadow-sm' : 'hover:bg-white bg-transparent border border-transparent'}`}
                >
                  <img src={conv.user.avatar || 'https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png'} className="w-12 h-12 rounded-full border border-gray-200 bg-white" alt="avatar" />
                  <div className="flex-1 min-w-0">
                    <h4 className="font-bold text-gray-900 truncate">{conv.user.username}</h4>
                    <p className={`text-sm truncate ${conv.unreadCount > 0 ? 'font-bold text-gray-900' : 'text-gray-500'}`}>
                      {conv.lastMessage?.text || "Started a conversation"}
                    </p>
                  </div>
                  {conv.unreadCount > 0 && (
                     <span className="bg-primary-500 text-white text-xs font-bold w-5 h-5 rounded-full flex items-center justify-center">
                       {conv.unreadCount}
                     </span>
                  )}
                </div>
              ))
            )}
          </div>
        </div>

        {/* Chat Area */}
        <div className={`w-full md:w-2/3 flex flex-col bg-white ${!activeUser ? 'hidden md:flex items-center justify-center' : ''}`}>
          {!activeUser ? (
            <div className="text-gray-400 text-center">
              <MessageCircle className="w-16 h-16 mx-auto mb-4 text-gray-200" />
              <p className="font-medium">Select a conversation to start chatting.</p>
            </div>
          ) : (
            <>
              {/* Chat Header */}
              <div className="p-4 sm:p-6 border-b border-gray-100 bg-white flex items-center gap-4 shadow-sm z-10">
                <button className="md:hidden text-gray-500" onClick={() => setActiveUser(null)}>
                  &larr; Back
                </button>
                <img src={activeUser.avatar || 'https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png'} className="w-10 h-10 rounded-full border border-gray-200" alt="avatar" />
                <h3 className="text-lg font-bold text-gray-900">{activeUser.username}</h3>
              </div>

              {/* Messages display */}
              <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4 bg-gray-50 custom-scrollbar">
                {messages.map((msg, i) => {
                  const isMine = msg.sender === (user._id || user.id);
                  return (
                    <div key={i} className={`flex ${isMine ? 'justify-end' : 'justify-start'}`}>
                      <div className={`max-w-[75%] rounded-2xl px-5 py-3 shadow-sm ${isMine ? 'bg-primary-600 text-white rounded-br-none' : 'bg-white text-gray-800 rounded-bl-none border border-gray-100'}`}>
                        <p className="text-[15px] leading-relaxed break-words">{msg.text}</p>
                        <span className={`text-[10px] block mt-1 ${isMine ? 'text-primary-100' : 'text-gray-400'}`}>
                          {new Date(msg.createdAt).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                        </span>
                      </div>
                    </div>
                  )
                })}
                <div ref={messagesEndRef} />
              </div>

              {/* Message Input */}
              <div className="p-4 sm:p-6 bg-white border-t border-gray-100">
                <form onSubmit={handleSendMessage} className="flex gap-3">
                  <input
                    type="text"
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    placeholder="Type a message..."
                    className="flex-1 px-5 py-3.5 bg-gray-50 border border-gray-200 rounded-full focus:bg-white focus:outline-none focus:ring-2 focus:ring-primary-500 transition-all text-[15px]"
                  />
                  <button 
                    type="submit" 
                    className="p-3.5 bg-gray-900 text-white rounded-full hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-900 shadow-md transition-colors"
                  >
                    <Send className="w-5 h-5 ml-0.5" />
                  </button>
                </form>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}


