import apiClient from '../api/client'

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

export function notifyQueueUpdated(doctorId: string) {
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

// Fetch Doctor Queue (merging local + backend API for cross-device QR scanning)
export function getQueueForDoctor(doctorId: string): QueueItem[] {
  if (!doctorId) return []
  try {
    const raw = localStorage.getItem(`clinic_os_queue_${doctorId}`)
    const localQueue: QueueItem[] = raw ? JSON.parse(raw) : []

    // Async background sync with FastAPI Backend API
    apiClient.getDoctorQueue(doctorId).then((res) => {
      if (res.data && Array.isArray(res.data.queue)) {
        const remoteItems: QueueItem[] = res.data.queue
        let hasNew = false

        for (const remote of remoteItems) {
          const existsIndex = localQueue.findIndex((l) => l.id === remote.id || (l.phone === remote.phone && l.check_in_time === remote.check_in_time))
          if (existsIndex === -1) {
            localQueue.push(remote)
            hasNew = true
          }
        }

        if (hasNew) {
          localStorage.setItem(`clinic_os_queue_${doctorId}`, JSON.stringify(localQueue))
          notifyQueueUpdated(doctorId)
        }
      }
    }).catch(() => {
      // backend offline, local fallback
    })

    return localQueue
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
  // Sync to Backend
  apiClient.updateDoctorQueueStatus(doctorId, itemId, status).catch(() => {})
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
