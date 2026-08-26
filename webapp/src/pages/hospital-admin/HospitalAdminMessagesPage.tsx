import { useState, useEffect } from 'react'
import { Send, CheckCheck } from 'lucide-react'
import HospitalAdminHeader from '../../components/HospitalAdminHeader'
import { useSEO } from '../../hooks/useSEO'

interface DoctorItem {
  id: string
  name: string
  dept: string
}

interface ChatMessage {
  id: string
  sender: 'admin' | 'doctor'
  doctorId: string
  text: string
  time: string
  status: 'sent' | 'delivered' | 'read'
}

export default function HospitalAdminMessagesPage() {
  useSEO({
    title: 'In-built Chat Page - Hospital Admin Dashboard',
    description: 'Send direct real-time instructions to practising doctors.',
  })

  const [hospitalDoctors] = useState<DoctorItem[]>(() => {
    try {
      const saved = localStorage.getItem('clinicos_hospital_doctors')
      if (saved) return JSON.parse(saved)
    } catch (e) {}
    return []
  })

  const [selectedChatDoctor, setSelectedChatDoctor] = useState<string>('')
  const [chatInputText, setChatInputText] = useState('')
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>(() => {
    try {
      const saved = localStorage.getItem('clinicos_chat_messages')
      if (saved) return JSON.parse(saved)
    } catch (e) {}
    return []
  })

  useEffect(() => {
    try {
      localStorage.setItem('clinicos_chat_messages', JSON.stringify(chatMessages))
    } catch (e) {}
  }, [chatMessages])

  const handleSendMessage = (e?: React.FormEvent) => {
    if (e) e.preventDefault()
    if (!chatInputText.trim()) return

    const newMsg: ChatMessage = {
      id: `msg-${Date.now()}`,
      sender: 'admin',
      doctorId: selectedChatDoctor,
      text: chatInputText.trim(),
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      status: 'read',
    }

    setChatMessages((prev) => [...prev, newMsg])
    setChatInputText('')

    setTimeout(() => {
      const doc = hospitalDoctors.find((d) => d.id === selectedChatDoctor)
      const docMsg: ChatMessage = {
        id: `msg-reply-${Date.now()}`,
        sender: 'doctor',
        doctorId: selectedChatDoctor,
        text: `Message received, Admin. Noted for ${doc?.name || 'Doctor'}.`,
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        status: 'read',
      }
      setChatMessages((prev) => [...prev, docMsg])
    }, 1200)
  }

  const currentDocMessages = chatMessages.filter((m) => m.doctorId === selectedChatDoctor)
  const currentDocObj = hospitalDoctors.find((d) => d.id === selectedChatDoctor) || hospitalDoctors[0]

  return (
    <div className="min-h-screen bg-[#f4f6f8] text-slate-800 font-sans p-4 sm:p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        <HospitalAdminHeader />

        <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-sm border border-slate-200/60 space-y-6 text-left">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-4">
            <div>
              <h1 className="text-2xl font-black text-slate-900 tracking-tight">Hospital In-built Chat System Page</h1>
              <p className="text-xs text-slate-500 font-medium">Direct real-time messaging with facility doctors</p>
            </div>
            <div className="flex items-center gap-2">
              <label className="text-xs font-bold text-slate-600">Select Doctor:</label>
              <select
                value={selectedChatDoctor}
                onChange={(e) => setSelectedChatDoctor(e.target.value)}
                className="px-4 py-2 bg-slate-100 border border-slate-200 rounded-xl text-xs font-bold text-slate-800 outline-none"
              >
                {hospitalDoctors.map((doc) => (
                  <option key={doc.id} value={doc.id}>{doc.name} ({doc.dept})</option>
                ))}
              </select>
            </div>
          </div>

          <div className="bg-slate-50 rounded-3xl p-6 border border-slate-200 space-y-4 max-w-3xl mx-auto min-h-[400px] flex flex-col justify-between shadow-xs">
            <div className="space-y-3 overflow-y-auto max-h-[340px] p-2 font-sans">
              {currentDocMessages.map((msg) => (
                <div
                  key={msg.id}
                  className={`flex flex-col ${msg.sender === 'admin' ? 'items-end' : 'items-start'}`}
                >
                  <div
                    className={`max-w-[75%] px-5 py-3 rounded-2xl text-xs leading-relaxed ${
                      msg.sender === 'admin'
                        ? 'bg-[#d8edd6] text-slate-900 rounded-tr-xs shadow-xs font-medium'
                        : 'bg-white text-slate-800 border border-slate-200 rounded-tl-xs shadow-xs'
                    }`}
                  >
                    <p>{msg.text}</p>
                    <div className={`flex items-center gap-1 justify-end pt-1 text-[9px] font-mono ${msg.sender === 'admin' ? 'text-emerald-800' : 'text-slate-400'}`}>
                      <span>{msg.time}</span>
                      {msg.sender === 'admin' && <CheckCheck size={12} className="text-emerald-700" />}
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <form onSubmit={handleSendMessage} className="pt-2 flex items-center gap-2 bg-white p-2 rounded-full border border-slate-200 shadow-sm">
              <input
                type="text"
                value={chatInputText}
                onChange={(e) => setChatInputText(e.target.value)}
                placeholder={`Write message to ${currentDocObj?.name}...`}
                className="flex-1 px-4 py-2 bg-transparent text-xs font-medium outline-none"
              />
              <button
                type="submit"
                className="w-10 h-10 rounded-full bg-[#00875A] hover:bg-[#007043] text-white flex items-center justify-center transition flex-shrink-0 shadow-sm"
              >
                <Send size={16} />
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  )
}
