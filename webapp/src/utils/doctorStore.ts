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

const queueChannel = typeof window !== 'undefined' && 'BroadcastChannel' in window ? new BroadcastChannel('clinic_os_queue_channel') : null

function notifyQueueUpdated(doctorId: string) {
  if (queueChannel) {
    try {
      queueChannel.postMessage({ type: 'QUEUE_UPDATED', doctorId })
    } catch (e) {
      // ignore
    }
  }
  if (typeof window !== 'undefined') {
    window.dispatchEvent(new CustomEvent('clinic_os_queue_updated', { detail: { doctorId } }))
  }
}

// Key format: clinic_os_queue_{doctor_id}
export function getQueueForDoctor(doctorId: string): QueueItem[] {
  if (!doctorId) return []
  try {
    const raw = localStorage.getItem(`clinic_os_queue_${doctorId}`)
    const queue = raw ? JSON.parse(raw) : []
    // Also merge global check-ins if any
    const globalRaw = localStorage.getItem('clinic_os_global_checkins')
    if (globalRaw) {
      const globalItems: QueueItem[] = JSON.parse(globalRaw)
      const matchingGlobal = globalItems.filter(item => item.doctor_id === doctorId)
      for (const item of matchingGlobal) {
        if (!queue.some((q: QueueItem) => q.id === item.id)) {
          queue.push(item)
        }
      }
    }
    return queue
  } catch (e) {
    return []
  }
}

export function saveQueueForDoctor(doctorId: string, queue: QueueItem[]): void {
  if (!doctorId) return
  localStorage.setItem(`clinic_os_queue_${doctorId}`, JSON.stringify(queue))
  notifyQueueUpdated(doctorId)
}

export function addCheckinToDoctorQueue(doctorId: string, payload: any): QueueItem {
  const existingQueue = getQueueForDoctor(doctorId)
  const todayStr = new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
  const timeStr = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })

  const tokenNum = `Token ${String(existingQueue.length + 1).padStart(3, '0')}`
  const receiptRef = `RCP-${Date.now().toString().substring(5)}`
  
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

  // Save to global fallback array so cross-context checkins are available
  try {
    const globalRaw = localStorage.getItem('clinic_os_global_checkins')
    const globalItems = globalRaw ? JSON.parse(globalRaw) : []
    globalItems.push(newItem)
    localStorage.setItem('clinic_os_global_checkins', JSON.stringify(globalItems))
  } catch (e) {
    // ignore
  }

  // Also automatically create an Appointment record for doctor's Appointments page!
  try {
    const existingApts = getAppointmentsForDoctor(doctorId)
    const newApt: AppointmentItem = {
      id: `apt-${Date.now()}`,
      doctor_id: doctorId,
      patient_name: newItem.patient_name,
      phone: newItem.phone,
      appointment_date: 'Today',
      appointment_time: timeStr,
      token_number: tokenNum,
      receipt_number: receiptRef,
      department: payload.department || 'Cardiology',
      status: 'Scheduled',
    }
    saveAppointmentsForDoctor(doctorId, [newApt, ...existingApts])
  } catch (e) {
    // ignore
  }

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
  notifyQueueUpdated(doctorId)
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
  notifyQueueUpdated(doctorId)
}
