import { useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import { Clock, CheckCircle, MapPin } from 'lucide-react'
import { Card, CardContent } from '../components/Card'

export default function IntakePage() {
  const { token } = useParams()
  const hospitalName = 'City Care Hospital'

  // Step state
  const [selectedDate, setSelectedDate] = useState('Today')
  const [selectedDoctor, setSelectedDoctor] = useState<any>(null)
  const [step, setStep] = useState<1 | 2 | 3 | 4>(1)

  // Patient Details
  const [formData, setFormData] = useState({
    name: '',
    age: '',
    phone: '',
    address: '',
    symptoms: '',
    previous_meds: '',
    consent: true
  })

  const [confirmedToken, setConfirmedToken] = useState<any>(null)

  // Dates Offered (Today + next 4 days)
  const dates = [
    { label: 'Today', date: 'Sat 23', slots: 12 },
    { label: 'Sun 24', date: 'Sun 24', slots: 18 },
    { label: 'Mon 25', date: 'Mon 25', slots: 20 },
    { label: 'Tue 26', date: 'Tue 26', slots: 20 },
  ]

  // Doctor Roster Grouped by Department (Specification 3.1)
  const doctors = [
    {
      id: 'doc-ortho',
      name: 'Dr. Ashok Verma',
      dept: 'ORTHOPAEDICS',
      dept_code: 'ORT',
      room: 'Room 4',
      waiting: 3,
      slots_left: 12,
      max_limit: 20,
      status: 'available'
    },
    {
      id: 'doc-gen',
      name: 'Dr. Sunita Rao',
      dept: 'GENERAL OPD',
      dept_code: 'GEN',
      room: 'Room 1',
      waiting: 11,
      slots_left: 4,
      max_limit: 40,
      status: 'available'
    },
    {
      id: 'doc-peds',
      name: 'Dr. Imran Qureshi',
      dept: 'PAEDIATRICS',
      dept_code: 'PED',
      room: 'Room 7',
      waiting: 18,
      slots_left: 0,
      max_limit: 18,
      status: 'fully_booked',
      next_free: '18 free tomorrow'
    },
    {
      id: 'doc-derma',
      name: 'Dr. Neha Kulkarni',
      dept: 'DERMATOLOGY',
      dept_code: 'DER',
      room: 'Room 9',
      waiting: 0,
      slots_left: 0,
      status: 'on_leave',
      next_free: 'on leave today'
    },
    {
      id: 'doc-ent',
      name: 'Dr. Rajiv Menon',
      dept: 'ENT',
      dept_code: 'ENT',
      room: 'Room 3',
      waiting: 2,
      slots_left: 15,
      max_limit: 25,
      status: 'available'
    }
  ]

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!selectedDoctor || !formData.name || !formData.phone) return

    const todayStr = new Date().toISOString().slice(0, 10).replace(/-/g, '')
    const visitToken = `${todayStr}30` // Token format: YYYYMMDD + sequence (e.g. 2026082230)
    const queueCode = `${selectedDoctor.dept_code}-07` // Queue code: ORT-07

    setConfirmedToken({
      token_number: visitToken,
      queue_code: queueCode,
      doctor: selectedDoctor.name,
      dept: selectedDoctor.dept,
      room: selectedDoctor.room,
      ahead: selectedDoctor.waiting,
      estimated_wait: 26,
      date: selectedDate
    })
    setStep(4)
  }

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 font-sans p-4 sm:p-6 selection:bg-blue-600 selection:text-white">
      <header className="max-w-xl mx-auto text-center space-y-2 mb-6">
        <img src="/assets/logo.png" alt="Clinic OS Logo" className="h-10 mx-auto object-contain" />
        <h1 className="text-2xl font-black text-slate-900 tracking-tight font-recoleta">{hospitalName}</h1>
        <p className="text-xs text-blue-600 font-bold bg-blue-50 px-3 py-1 rounded-full border border-blue-100 inline-block">
          Hospital Entrance QR Intake Form ({token || 'Single QR Code'})
        </p>
      </header>

      <div className="max-w-xl mx-auto">
        {step === 4 && confirmedToken ? (
          <Card className="rounded-3xl border-2 border-emerald-500 bg-white shadow-2xl overflow-hidden text-center space-y-6 p-8">
            <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto shadow-md">
              <CheckCircle size={40} />
            </div>

            <div>
              <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">Visit Token Number</p>
              <p className="text-4xl font-black text-slate-900 font-mono mt-1">{confirmedToken.token_number}</p>
            </div>

            <div className="bg-blue-50 border border-blue-200 p-6 rounded-2xl space-y-2">
              <p className="text-xs font-bold text-blue-600 uppercase tracking-widest">Live Queue Position</p>
              <p className="text-5xl font-black text-blue-700 font-mono">{confirmedToken.queue_code}</p>
              <p className="text-xs font-extrabold text-slate-800">{confirmedToken.doctor} • {confirmedToken.dept}</p>
              <p className="text-xs text-slate-600 flex items-center justify-center gap-1">
                <MapPin size={14} className="text-blue-600" /> {confirmedToken.room}
              </p>
            </div>

            <div className="flex items-center justify-center gap-4 text-xs font-bold text-slate-600 bg-slate-50 p-4 rounded-2xl border border-slate-200">
              <div>
                <p className="text-slate-400 font-normal">Patients Ahead</p>
                <p className="text-base text-slate-900 font-black">{confirmedToken.ahead} Patients</p>
              </div>
              <div className="h-8 w-px bg-slate-300" />
              <div>
                <p className="text-slate-400 font-normal">Estimated Wait</p>
                <p className="text-base text-blue-600 font-black flex items-center gap-1">
                  <Clock size={16} /> ~{confirmedToken.estimated_wait} Mins
                </p>
              </div>
            </div>

            <Link
              to={`/track?token=${confirmedToken.token_number}&phone=${formData.phone}`}
              className="block w-full py-4 bg-blue-600 hover:bg-blue-700 text-white font-extrabold text-xs uppercase tracking-wider rounded-2xl shadow-lg shadow-blue-600/30 transition"
            >
              Track Live Queue on Phone →
            </Link>
          </Card>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* STEP 1: DATE SELECTION */}
            <Card className="rounded-3xl border border-slate-200 shadow-md">
              <CardContent className="p-6 space-y-3">
                <p className="text-xs font-bold text-slate-500 uppercase tracking-widest">Step 1. Select Appointment Date</p>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  {dates.map((d) => (
                    <button
                      key={d.label}
                      type="button"
                      onClick={() => setSelectedDate(d.label)}
                      className={`p-3 rounded-2xl border text-center transition ${
                        selectedDate === d.label
                          ? 'bg-blue-600 text-white border-blue-600 shadow-md'
                          : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                      }`}
                    >
                      <p className="font-extrabold text-xs">{d.label}</p>
                      <p className="text-[10px] opacity-80 mt-0.5">{d.slots} slots left</p>
                    </button>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* STEP 2: DOCTOR ROSTER SELECTION (Specification 3.1) */}
            <Card className="rounded-3xl border border-slate-200 shadow-md">
              <CardContent className="p-6 space-y-3">
                <p className="text-xs font-bold text-slate-500 uppercase tracking-widest">Step 2. Choose Doctor / Department</p>
                <div className="space-y-3">
                  {doctors.map((doc) => {
                    const isSelected = selectedDoctor?.id === doc.id
                    const isFull = doc.status === 'fully_booked'
                    const isLeave = doc.status === 'on_leave'

                    return (
                      <button
                        key={doc.id}
                        type="button"
                        disabled={isFull || isLeave}
                        onClick={() => {
                          setSelectedDoctor(doc)
                          setStep(3)
                        }}
                        className={`w-full p-4 rounded-2xl border text-left flex items-center justify-between transition ${
                          isSelected
                            ? 'bg-blue-50 border-2 border-blue-600 shadow-md'
                            : isFull || isLeave
                            ? 'bg-slate-100 border-slate-200 opacity-60 cursor-not-allowed'
                            : 'bg-white border-slate-200 hover:border-blue-400'
                        }`}
                      >
                        <div className="space-y-0.5">
                          <p className="text-xs font-bold text-blue-600 uppercase tracking-wider">{doc.dept}</p>
                          <p className="font-black text-slate-900 text-sm">{doc.name} • <span className="text-xs text-slate-500 font-normal">{doc.room}</span></p>
                        </div>

                        <div className="text-right text-xs">
                          {isFull ? (
                            <span className="px-2.5 py-1 bg-amber-100 text-amber-800 font-extrabold rounded-full text-[10px]">
                              Fully Booked ({doc.next_free})
                            </span>
                          ) : isLeave ? (
                            <span className="px-2.5 py-1 bg-slate-200 text-slate-600 font-bold rounded-full text-[10px]">
                              On Leave Today
                            </span>
                          ) : (
                            <div>
                              <span className="font-extrabold text-emerald-600">{doc.waiting} waiting</span>
                              <span className="text-slate-400 text-[11px] block">{doc.slots_left} of {doc.max_limit} slots left</span>
                            </div>
                          )}
                        </div>
                      </button>
                    )
                  })}
                </div>
              </CardContent>
            </Card>

            {/* STEP 3: PATIENT DETAILS */}
            {selectedDoctor && (
              <Card className="rounded-3xl border-2 border-blue-600 shadow-xl bg-white">
                <CardContent className="p-6 space-y-4">
                  <p className="text-xs font-bold text-blue-600 uppercase tracking-widest">
                    Step 3. Patient Details for {selectedDoctor.name} ({selectedDoctor.dept})
                  </p>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-[11px] font-extrabold text-slate-700 uppercase tracking-wider mb-1">Full Name *</label>
                      <input
                        type="text"
                        required
                        placeholder="Patient Name"
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs font-semibold focus:ring-2 focus:ring-blue-600 outline-none"
                      />
                    </div>

                    <div>
                      <label className="block text-[11px] font-extrabold text-slate-700 uppercase tracking-wider mb-1">Mobile Phone *</label>
                      <input
                        type="tel"
                        required
                        maxLength={10}
                        placeholder="9876543210"
                        value={formData.phone}
                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                        className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs font-semibold focus:ring-2 focus:ring-blue-600 outline-none"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-[11px] font-extrabold text-slate-700 uppercase tracking-wider mb-1">Age</label>
                      <input
                        type="number"
                        placeholder="35"
                        value={formData.age}
                        onChange={(e) => setFormData({ ...formData, age: e.target.value })}
                        className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs font-semibold focus:ring-2 focus:ring-blue-600 outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] font-extrabold text-slate-700 uppercase tracking-wider mb-1">City / Address</label>
                      <input
                        type="text"
                        placeholder="Kolkata"
                        value={formData.address}
                        onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                        className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs font-semibold focus:ring-2 focus:ring-blue-600 outline-none"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-[11px] font-extrabold text-slate-700 uppercase tracking-wider mb-1">Reason for Visit / Symptoms *</label>
                    <textarea
                      required
                      rows={2}
                      placeholder="e.g. Severe knee pain for 1 month"
                      value={formData.symptoms}
                      onChange={(e) => setFormData({ ...formData, symptoms: e.target.value })}
                      className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs font-semibold focus:ring-2 focus:ring-blue-600 outline-none"
                    />
                  </div>

                  <button
                    type="submit"
                    className="w-full py-4 bg-blue-600 hover:bg-blue-700 text-white font-extrabold text-sm uppercase tracking-wider rounded-2xl shadow-xl shadow-blue-600/30 transition"
                  >
                    Confirm & Get Token for {selectedDoctor.name}
                  </button>
                </CardContent>
              </Card>
            )}
          </form>
        )}
      </div>
    </div>
  )
}
