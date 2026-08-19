import { useMutation, useQuery, UseQueryResult, UseMutationResult } from 'react-query'
import apiClient from '../api/client'

// Hook for appointments
export const useAppointments = (filters?: any): UseQueryResult<any> => {
  return useQuery(['appointments', filters], () => apiClient.listAppointments(filters), {
    enabled: !!apiClient.getClinicId(),
  })
}

export const useAppointment = (appointmentId: string): UseQueryResult<any> => {
  return useQuery(['appointment', appointmentId], () => apiClient.getAppointment(appointmentId), {
    enabled: !!appointmentId && !!apiClient.getClinicId(),
  })
}

export const useAvailableSlots = (doctorId: string, dateFrom?: string, dateTo?: string): UseQueryResult<any> => {
  return useQuery(
    ['availableSlots', doctorId, dateFrom, dateTo],
    () => apiClient.getAvailableSlots(doctorId, dateFrom || '', dateTo || ''),
    {
      enabled: !!doctorId && !!dateFrom && !!dateTo && !!apiClient.getClinicId(),
    }
  )
}

export const useBookAppointment = (): UseMutationResult<any, any, any> => {
  return useMutation((data) => apiClient.bookAppointment(data))
}

export const useConfirmAppointment = (): UseMutationResult<any, any, string> => {
  return useMutation((appointmentId) => apiClient.confirmAppointment(appointmentId))
}

export const useRescheduleAppointment = (): UseMutationResult<any, any, { appointmentId: string; newDate: string }> => {
  return useMutation(({ appointmentId, newDate }) => apiClient.rescheduleAppointment(appointmentId, newDate))
}

export const useCancelAppointment = (): UseMutationResult<any, any, { appointmentId: string; reason?: string }> => {
  return useMutation(({ appointmentId, reason }) => apiClient.cancelAppointment(appointmentId, reason))
}

export const useAppointmentStats = (): UseQueryResult<any> => {
  return useQuery(['appointmentStats'], () => apiClient.getAppointmentStats(), {
    enabled: !!apiClient.getClinicId(),
  })
}

// Hook for check-ins
export const useSubmitCheckin = (): UseMutationResult<any, any, any> => {
  return useMutation((data) => apiClient.submitCheckin(data))
}

export const useCheckinStats = (): UseQueryResult<any> => {
  return useQuery(['checkinStats'], () => apiClient.getCheckinStats(), {
    enabled: !!apiClient.getClinicId(),
  })
}
