import { useState, useEffect } from 'react'
import { useParams, Link, useSearchParams } from 'react-router-dom'
import { Clock, CheckCircle, MapPin, DollarSign, Stethoscope, ShieldAlert, Building2, User, Calendar } from 'lucide-react'
import { Card, CardContent } from '../components/Card'
import PaymentUI from '../components/PaymentUI'
import { addCheckinToDoctorQueue, getQueueForDoctor, notifyQueueUpdated } from '../utils/doctorStore'

interface HospitalData {
  id: string
  name: string
  intake_token: string
  status: string
  phone?: string
  address?: string
}

interface DoctorData {
  id: string
  hospital_id: string
  name: string
  email: string
  dept: string
  specialization?: string
  qualification?: string
  room?: string
  fee: number
  limit: number
  status: string
  is_available?: boolean
}

export default function IntakePage() {
  const { token } = useParams()
  const [searchParams] = useSearchParams()
  const tokenQuery = searchParams.get('token') || searchParams.get('hosp') || token || ''

  const [hospital, setHospital] = useState<HospitalData | null>(null)
  const [doctorsList, setDoctorsList] = useState<DoctorData[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // Step state (1: Date, 2: Doctor, 3: Details, 4: Payment, 5: Success Token)
  const [selectedDate, setSelectedDate] = useState<string>('Today')
  const [selectedDoctor, setSelectedDoctor] = useState<DoctorData | null>(null)
  const [step, setStep] = useState<1 | 2 | 3 | 4 | 5>(1)

  // Patient Details Form State
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

  // Dynamic Available Dates
  const todayDate = new Date()
  const dates = [
    { label: 'Today', date: todayDate.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' }) },
    { label: 'Tomorrow', date: new Date(Date.now() + 86400000).toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' }) },
    { label: 'Day After', date: new Date(Date.now() + 172800000).toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' }) },
  ]

  // 1. Resolve Scanned Hospital & Registered Doctors on Mount
  useEffect(() => {
    setIsLoading(true)
    setError(null)

    try {
      const savedHospitalsRaw = localStorage.getItem('clinicos_hospitals')
      const hospitals: HospitalData[] = savedHospitalsRaw ? JSON.parse(savedHospitalsRaw) : []

      // Match hospital by intake_token, id, or default fallback if single hospital exists
      let matchedHosp = hospitals.find(
        (h) =>
          h.intake_token === tokenQuery ||
          h.id === tokenQuery ||
          `tok_${h.id}` === tokenQuery ||
          tokenQuery.includes(h.id)
      )

      // Fallback: If only 1 hospital exists in storage, use it
      if (!matchedHosp && hospitals.length > 0) {
        matchedHosp = hospitals[0]
      }

      if (!matchedHosp) {
        // Create default active hospital record if none registered yet
        matchedHosp = {
          id: 'hosp-001',
          name: 'City Care Hospital',
          intake_token: tokenQuery || 'default-token',
          status: 'active',
          address: 'Main Healthcare Boulevard',
        }
      }

      if (matchedHosp.status === 'suspended') {
        setError(`Hospital "${matchedHosp.name}" is currently suspended. Online QR booking is temporarily unavailable.`)
        setIsLoading(false)
        return
      }

      setHospital(matchedHosp)

      // Fetch ONLY Registered & Active Doctors for this specific hospital ID
      const savedDoctorsRaw = localStorage.getItem('clinicos_hospital_doctors')
      const allDoctors: DoctorData[] = savedDoctorsRaw ? JSON.parse(savedDoctorsRaw) : []

      // Filter doctors belonging to THIS hospital who are active
      const hospitalDocs = allDoctors.filter(
        (d) =>
          (d.hospital_id === matchedHosp!.id || !d.hospital_id || matchedHosp!.id === 'hosp-001') &&
          d.status !== 'inactive'
      )

      setDoctorsList(hospitalDocs)
    } catch (e) {
      console.error('Error resolving QR token:', e)
      setError('Failed to resolve hospital details from QR token.')
    } finally {
      setIsLoading(false)
    }
  }, [tokenQuery])

  const handleProceedToPayment = (e: React.FormEvent) => {
    e.preventDefault()
    if (!selectedDoctor || !formData.name || !formData.phone) return
    setStep(4) // Move to Payment Step
  }

  const handlePaymentSuccess = (paymentId: string, transactionId: string) => {
    if (!selectedDoctor || !hospital) return

    // Calculate Doctor-Independent Queue Number
    const existingQueue = getQueueForDoctor(selectedDoctor.id)
    const queueNum = existingQueue.length + 1
    const deptCode = (selectedDoctor.dept || 'GEN').substring(0, 3).toUpperCase()
    const queueCode = `${deptCode}-${String(queueNum).padStart(2, '0')}`

    const todayStr = new Date().toISOString().slice(0, 10).replace(/-/g, '')
    const visitToken = `${todayStr}${String(queueNum).padStart(2, '0')}`

    // Create Atomic Queue & Appointment Record strictly assigned to hospital_id and doctor_id
    const checkinPayload = {
      name: formData.name,
      phone: formData.phone,
      age: Number(formData.age) || 30,
      gender: 'Other',
      symptoms: formData.symptoms,
      hospital_id: hospital.id,
      hospital_name: hospital.name,
      doctor_id: selectedDoctor.id,
      department: selectedDoctor.dept,
    }

    addCheckinToDoctorQueue(selectedDoctor.id, checkinPayload)
    notifyQueueUpdated(selectedDoctor.id)

    // Save Appointment in persistent hospital appointments store
    try {
      const savedAptsRaw = localStorage.getItem('clinicos_appointments')
      const allApts: any[] = savedAptsRaw ? JSON.parse(savedAptsRaw) : []
      const newApt = {
        id: `apt-${Date.now()}`,
        hospital_id: hospital.id,
        hospital_name: hospital.name,
        doctor_id: selectedDoctor.id,
        doctor_name: selectedDoctor.name,
        patient_name: formData.name,
        patient_phone: formData.phone,
        appointment_date: selectedDate,
        appointment_time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        queue_number: queueNum,
        token_number: visitToken,
        department: selectedDoctor.dept,
        room: selectedDoctor.room || 'Room 101',
        fee: selectedDoctor.fee || 500,
        status: 'Scheduled',
        payment_id: paymentId,
        transaction_id: transactionId,
        created_at: new Date().toISOString()
      }
      allApts.push(newApt)
      localStorage.setItem('clinicos_appointments', JSON.stringify(allApts))
    } catch (e) {}

    setConfirmedToken({
      token_number: visitToken,
      queue_code: queueCode,
      queue_number: queueNum,
      hospital: hospital.name,
      doctor: selectedDoctor.name,
      dept: selectedDoctor.dept,
      room: selectedDoctor.room || 'Room 101',
      fee: selectedDoctor.fee || 500,
      ahead: queueNum - 1,
      estimated_wait: Math.max(5, (queueNum - 1) * 10),
      date: selectedDate,
      payment_id: paymentId,
      transaction_id: transactionId
    })
    setStep(5)
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-slate-900 flex items-center justify-center p-4 font-sans text-white">
        <div className="text-center space-y-3">
          <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto" />
          <p className="text-sm font-bold text-slate-300">Resolving Secure Hospital QR Token...</p>
        </div>
      </div>
    )
  }

  if (error || !hospital) {
    return (
      <div className="min-h-screen bg-slate-900 flex items-center justify-center p-4 font-sans text-white">
        <div className="max-w-md w-full bg-slate-950 border border-red-500/30 rounded-3xl p-8 text-center space-y-4 shadow-2xl">
          <ShieldAlert size={48} className="mx-auto text-red-400" />
          <h2 className="text-xl font-black text-white">Invalid or Suspended Hospital QR Code</h2>
          <p className="text-xs text-slate-400 font-medium">
            {error || 'This QR token is not recognized by Clinic OS. Please scan a valid hospital entrance QR code.'}
          </p>
          <Link
            to="/"
            className="inline-block px-5 py-2.5 bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs rounded-xl transition shadow-lg shadow-blue-600/30"
          >
            Go to Clinic OS Home
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 font-sans p-4 sm:p-6 selection:bg-blue-600 selection:text-white">
      {/* 2. QR PAGE DYNAMIC HEADING FROM DATABASE */}
      <header className="max-w-xl mx-auto text-center space-y-2 mb-6">
        <img src="/assets/logo.png" alt="Clinic OS Logo" className="h-10 mx-auto object-contain bg-white px-2 py-1 rounded-xl shadow-md" />
        
        {/* Dynamic Hospital Name */}
        <h1 className="text-3xl font-black text-white tracking-tight font-recoleta">
          {hospital.name}
        </h1>
        <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-blue-500/20 text-blue-300 font-bold text-xs rounded-full border border-blue-500/30">
          <Building2 size={14} /> Book Your Appointment
        </div>
        {hospital.address && <p className="text-xs text-slate-400">📍 {hospital.address}</p>}
      </header>

      <div className="max-w-xl mx-auto">
        {/* STEP 5: CONFIRMATION TOKEN */}
        {step === 5 && confirmedToken ? (
          <Card className="rounded-3xl border-2 border-emerald-500 bg-slate-900 shadow-2xl overflow-hidden text-center space-y-6 p-8 text-white">
            <div className="w-16 h-16 bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 rounded-full flex items-center justify-center mx-auto shadow-md">
              <CheckCircle size={40} />
            </div>

            <div>
              <span className="px-3.5 py-1.5 bg-emerald-500/20 text-emerald-300 font-extrabold text-xs rounded-full border border-emerald-500/30 uppercase tracking-widest">
                ✓ Booking Confirmed & Fee Paid (₹{confirmedToken.fee})
              </span>
              <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mt-4">Live Visit Token Number</p>
              <p className="text-4xl font-black text-white font-mono mt-1">{confirmedToken.token_number}</p>
              <p className="text-[11px] font-mono text-slate-500">Txn Ref: {confirmedToken.transaction_id}</p>
            </div>

            <div className="bg-blue-600/10 border border-blue-500/30 p-6 rounded-2xl space-y-2">
              <p className="text-xs font-bold text-blue-400 uppercase tracking-widest">Independent Doctor Queue Position</p>
              <p className="text-5xl font-black text-blue-300 font-mono">{confirmedToken.queue_code}</p>
              <p className="text-base font-extrabold text-white">{confirmedToken.doctor} • {confirmedToken.dept}</p>
              <p className="text-xs text-slate-300 flex items-center justify-center gap-1">
                <MapPin size={14} className="text-blue-400" /> {confirmedToken.room}
              </p>
            </div>

            <div className="flex items-center justify-center gap-6 text-xs font-bold text-slate-300 bg-slate-950 p-4 rounded-2xl border border-slate-800">
              <div>
                <p className="text-slate-400 font-normal">Patients Ahead</p>
                <p className="text-lg text-white font-black">{confirmedToken.ahead} Patients</p>
              </div>
              <div className="h-8 w-px bg-slate-800" />
              <div>
                <p className="text-slate-400 font-normal">Estimated Wait</p>
                <p className="text-lg text-blue-400 font-black flex items-center gap-1">
                  <Clock size={16} /> ~{confirmedToken.estimated_wait} Mins
                </p>
              </div>
            </div>

            <Link
              to={`/track?token=${confirmedToken.token_number}&phone=${formData.phone}`}
              className="block w-full py-4 bg-blue-600 hover:bg-blue-500 text-white font-extrabold text-xs uppercase tracking-wider rounded-2xl shadow-lg shadow-blue-600/30 transition text-center"
            >
              Track Live Queue Position on Phone →
            </Link>
          </Card>
        ) : step === 4 && selectedDoctor ? (
          <PaymentUI
            appointmentId={`appt-${Date.now()}`}
            consultationFee={selectedDoctor.fee}
            doctorName={selectedDoctor.name}
            patientPhone={formData.phone}
            patientName={formData.name}
            onPaymentSuccess={handlePaymentSuccess}
            onPaymentError={(err) => alert(`Payment error: ${err}`)}
          />
        ) : (
          <form onSubmit={handleProceedToPayment} className="space-y-6">
            {/* STEP 1: DATE SELECTION */}
            <Card className="rounded-3xl border border-slate-800 bg-slate-950 shadow-xl">
              <CardContent className="p-6 space-y-3">
                <p className="text-xs font-bold text-slate-400 uppercase tracking-widest flex items-center gap-1.5">
                  <Calendar size={14} className="text-blue-400" /> Step 1. Select Appointment Date
                </p>
                <div className="grid grid-cols-3 gap-2">
                  {dates.map((d) => (
                    <button
                      key={d.label}
                      type="button"
                      onClick={() => setSelectedDate(d.label)}
                      className={`p-3 rounded-2xl border text-center transition ${
                        selectedDate === d.label
                          ? 'bg-blue-600 text-white border-blue-500 shadow-lg shadow-blue-600/30 font-bold'
                          : 'bg-slate-900 text-slate-300 border-slate-800 hover:bg-slate-800 font-medium'
                      }`}
                    >
                      <p className="text-xs font-bold">{d.label}</p>
                      <p className="text-[10px] opacity-80 mt-0.5">{d.date}</p>
                    </button>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* STEP 2: SHOW ONLY REGISTERED REAL DOCTORS FOR THIS HOSPITAL */}
            <Card className="rounded-3xl border border-slate-800 bg-slate-950 shadow-xl">
              <CardContent className="p-6 space-y-3">
                <p className="text-xs font-bold text-slate-400 uppercase tracking-widest flex items-center gap-1.5">
                  <Stethoscope size={14} className="text-blue-400" /> Step 2. Select Registered Doctor at {hospital.name}
                </p>

                {doctorsList.length === 0 ? (
                  <div className="p-8 bg-slate-900 border border-slate-800 rounded-2xl text-center space-y-2">
                    <Stethoscope size={36} className="mx-auto text-slate-600" />
                    <p className="text-sm font-bold text-slate-300">No doctors are currently available.</p>
                    <p className="text-xs text-slate-500">The hospital administration has not onboarded active doctors for QR booking yet.</p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {doctorsList.map((doc) => {
                      const isSelected = selectedDoctor?.id === doc.id
                      const docQueue = getQueueForDoctor(doc.id)
                      const waitingCount = docQueue.filter((q) => q.status === 'Waiting' || q.status === 'With Doctor').length
                      const slotsLimit = doc.limit || 25
                      const slotsLeft = Math.max(0, slotsLimit - waitingCount)
                      const isFull = slotsLeft === 0

                      return (
                        <button
                          key={doc.id}
                          type="button"
                          disabled={isFull}
                          onClick={() => {
                            setSelectedDoctor(doc)
                            setStep(3)
                          }}
                          className={`w-full p-4 rounded-2xl border text-left flex items-center justify-between transition ${
                            isSelected
                              ? 'bg-blue-600/10 border-2 border-blue-500 shadow-lg shadow-blue-500/20'
                              : isFull
                              ? 'bg-slate-900 border-slate-800 opacity-50 cursor-not-allowed'
                              : 'bg-slate-900 border-slate-800 hover:border-blue-500/40'
                          }`}
                        >
                          <div className="space-y-1">
                            <span className="px-2 py-0.5 bg-blue-500/10 text-blue-400 font-mono text-[10px] font-bold rounded border border-blue-500/20 uppercase">
                              {doc.dept || 'GENERAL'}
                            </span>
                            <p className="font-bold text-white text-base mt-1">
                              {doc.name}
                            </p>
                            <p className="text-xs text-slate-400">
                              {doc.qualification || 'MBBS, MD'} • <span className="text-slate-300 font-medium">{doc.specialization || doc.dept}</span>
                            </p>
                            <div className="flex items-center gap-3 text-xs pt-1">
                              <span className="text-slate-400 flex items-center gap-1">
                                <MapPin size={12} className="text-blue-400" /> {doc.room || 'Room 101'}
                              </span>
                              <span className="px-2 py-0.5 bg-emerald-500/10 text-emerald-400 font-black rounded border border-emerald-500/20">
                                Fee: ₹{doc.fee || 500}
                              </span>
                            </div>
                          </div>

                          <div className="text-right text-xs">
                            {isFull ? (
                              <span className="px-2.5 py-1 bg-amber-500/20 text-amber-300 font-extrabold rounded-full text-[10px]">
                                Fully Booked Today
                              </span>
                            ) : (
                              <div className="space-y-0.5">
                                <p className="font-black text-amber-400">{waitingCount} Currently Waiting</p>
                                <p className="text-slate-400 text-[11px] font-medium">{slotsLeft} of {slotsLimit} slots available</p>
                              </div>
                            )}
                          </div>
                        </button>
                      )
                    })}
                  </div>
                )}
              </CardContent>
            </Card>

            {/* STEP 3: PATIENT DETAILS FORM */}
            {selectedDoctor && (
              <Card className="rounded-3xl border-2 border-blue-500 bg-slate-950 shadow-2xl">
                <CardContent className="p-6 space-y-4">
                  <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                    <p className="text-xs font-bold text-blue-400 uppercase tracking-widest flex items-center gap-1.5">
                      <User size={14} /> Step 3. Patient Details for {selectedDoctor.name}
                    </p>
                    <span className="font-extrabold text-emerald-400 bg-emerald-500/10 px-3 py-1 rounded-full border border-emerald-500/20 text-xs">
                      Consultation Fee: ₹{selectedDoctor.fee || 500}
                    </span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-[11px] font-bold text-slate-300 uppercase tracking-wider mb-1">Full Name *</label>
                      <input
                        type="text"
                        required
                        placeholder="Patient Full Name"
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        className="w-full px-3.5 py-2.5 bg-slate-900 border border-slate-800 rounded-xl text-xs font-semibold text-white focus:border-blue-500 outline-none"
                      />
                    </div>

                    <div>
                      <label className="block text-[11px] font-bold text-slate-300 uppercase tracking-wider mb-1">Mobile Phone *</label>
                      <input
                        type="tel"
                        required
                        maxLength={10}
                        placeholder="9876543210"
                        value={formData.phone}
                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                        className="w-full px-3.5 py-2.5 bg-slate-900 border border-slate-800 rounded-xl text-xs font-semibold text-white focus:border-blue-500 outline-none"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-[11px] font-bold text-slate-300 uppercase tracking-wider mb-1">Age</label>
                      <input
                        type="number"
                        placeholder="35"
                        value={formData.age}
                        onChange={(e) => setFormData({ ...formData, age: e.target.value })}
                        className="w-full px-3.5 py-2.5 bg-slate-900 border border-slate-800 rounded-xl text-xs font-semibold text-white focus:border-blue-500 outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] font-bold text-slate-300 uppercase tracking-wider mb-1">City / Address</label>
                      <input
                        type="text"
                        placeholder="City"
                        value={formData.address}
                        onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                        className="w-full px-3.5 py-2.5 bg-slate-900 border border-slate-800 rounded-xl text-xs font-semibold text-white focus:border-blue-500 outline-none"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold text-slate-300 uppercase tracking-wider mb-1">Reason for Visit / Symptoms *</label>
                    <textarea
                      required
                      rows={2}
                      placeholder="e.g. Chest tightness or routine checkup"
                      value={formData.symptoms}
                      onChange={(e) => setFormData({ ...formData, symptoms: e.target.value })}
                      className="w-full px-3.5 py-2.5 bg-slate-900 border border-slate-800 rounded-xl text-xs font-semibold text-white focus:border-blue-500 outline-none"
                    />
                  </div>

                  <button
                    type="submit"
                    className="w-full py-4 bg-blue-600 hover:bg-blue-500 text-white font-black text-xs uppercase tracking-wider rounded-2xl shadow-xl shadow-blue-600/30 transition flex items-center justify-center gap-2"
                  >
                    <DollarSign size={16} /> Proceed to Pay ₹{selectedDoctor.fee || 500} & Confirm Booking
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
