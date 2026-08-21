export interface QueueItem {
  id: string
  doctor_id: string
  token_number: string
  patient_name: string
  phone: string
  age?: number
  gender?: string
  symptoms?: string
  severity?: string
  allergies?: string
  status: 'Waiting' | 'With Doctor' | 'Completed' | 'Skipped'
  check_in_time: string
  date: string
}

export interface AppointmentItem {
  id: string
  doctor_id: string
  patient_name: string
  phone: string
  appointment_date: string
  appointment_time: string
  token_number: string
  receipt_number: string
  department: string
  status: 'Scheduled' | 'Completed' | 'Cancelled'
}

export interface ReportItem {
  id: string
  doctor_id: string
  patient_name: string
  report_title: string
  report_type: string
  date: string
  doctor_notes: string
  findings: string
}

// Key format: clinic_os_queue_{doctor_id}
export function getQueueForDoctor(doctorId: string): QueueItem[] {
  if (!doctorId) return []
  try {
    const raw = localStorage.getItem(`clinic_os_queue_${doctorId}`)
    return raw ? JSON.parse(raw) : []
  } catch (e) {
    return []
  }
}

export function saveQueueForDoctor(doctorId: string, queue: QueueItem[]): void {
  if (!doctorId) return
  localStorage.setItem(`clinic_os_queue_${doctorId}`, JSON.stringify(queue))
}

export function addCheckinToDoctorQueue(doctorId: string, payload: any): QueueItem {
  const existingQueue = getQueueForDoctor(doctorId)
  const todayStr = new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
  const timeStr = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })

  const tokenNum = `Token ${String(existingQueue.length + 1).padStart(3, '0')}`
  const newItem: QueueItem = {
    id: `q-${Date.now()}`,
    doctor_id: doctorId,
    token_number: tokenNum,
    patient_name: payload.name || 'Patient',
    phone: payload.phone || '',
    age: payload.age,
    gender: payload.gender,
    symptoms: payload.symptoms || '',
    severity: payload.severity || 'moderate',
    allergies: payload.allergies || '',
    status: 'Waiting',
    check_in_time: timeStr,
    date: todayStr,
  }

  const updatedQueue = [...existingQueue, newItem]
  saveQueueForDoctor(doctorId, updatedQueue)
  return newItem
}

export function updateQueueStatusForDoctor(doctorId: string, itemId: string, status: QueueItem['status']): QueueItem[] {
  const existing = getQueueForDoctor(doctorId)
  const updated = existing.map((item) => (item.id === itemId ? { ...item, status } : item))
  saveQueueForDoctor(doctorId, updated)
  return updated
}

// Doctor-Specific Appointments Store
export function getAppointmentsForDoctor(doctorId: string): AppointmentItem[] {
  if (!doctorId) return []
  try {
    const raw = localStorage.getItem(`clinic_os_appointments_${doctorId}`)
    return raw ? JSON.parse(raw) : []
  } catch (e) {
    return []
  }
}

export function saveAppointmentsForDoctor(doctorId: string, items: AppointmentItem[]): void {
  if (!doctorId) return
  localStorage.setItem(`clinic_os_appointments_${doctorId}`, JSON.stringify(items))
}

// Doctor-Specific Reports Store
export function getReportsForDoctor(doctorId: string): ReportItem[] {
  if (!doctorId) return []
  try {
    const raw = localStorage.getItem(`clinic_os_reports_${doctorId}`)
    return raw ? JSON.parse(raw) : []
  } catch (e) {
    return []
  }
}

export function saveReportsForDoctor(doctorId: string, items: ReportItem[]): void {
  if (!doctorId) return
  localStorage.setItem(`clinic_os_reports_${doctorId}`, JSON.stringify(items))
}
