import { useState } from 'react'
import { Phone, User, AlertCircle, CheckCircle } from 'lucide-react'
import Layout from '../components/Layout'
import { Card, CardContent, CardHeader } from '../components/Card'
import Button from '../components/Button'
import { useSubmitCheckin } from '../hooks/useApi'

export default function Checkin() {
  const [step, setStep] = useState<'form' | 'success'>('form')
  const [formData, setFormData] = useState({
    phone: '',
    name: '',
    age: '',
    gender: '',
    symptoms: '',
    medical_history: '',
    allergies: '',
    current_medications: '',
    previous_doctor: '',
    previous_medication: '',
    duration_symptoms: '',
    severity: 'moderate',
    chronic_conditions: '',
    past_surgeries: '',
    consent_ai_triage: false,
    source: 'web',
  })

  const [response, setResponse] = useState<any>(null)
  const { mutate: submitCheckin, isLoading, error } = useSubmitCheckin()

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target as any
    if (type === 'checkbox') {
      setFormData((prev) => ({
        ...prev,
        [name]: (e.target as HTMLInputElement).checked,
      }))
    } else {
      setFormData((prev) => ({
        ...prev,
        [name]: value,
      }))
    }
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    // Clean up form data - remove empty optional fields
    const cleanedData = Object.fromEntries(
      Object.entries(formData).filter(([_, value]) => {
        // Keep required fields and non-empty optional fields
        if (value === '' || value === null) {
          return ['phone', 'name', 'symptoms'].includes(_) // only keep if required
        }
        return true
      })
    )

    // Convert age to number if present
    const payload: Record<string, any> = { ...cleanedData }
    if (payload.age && typeof payload.age === 'string') {
      payload.age = parseInt(payload.age, 10)
    }

    submitCheckin(payload, {
      onSuccess: (data) => {
        setResponse(data.data)
        setStep('success')
        // Auto-scroll to success message
        setTimeout(() => window.scrollTo({ top: 0, behavior: 'smooth' }), 100)
      },
    })
  }

  if (step === 'success' && response) {
    return (
      <Layout userRole="patient">
        <div className="max-w-2xl mx-auto">
          <div className="space-y-6">
            {/* Success Message */}
            <Card className="border-2 border-green-200 bg-green-50">
              <CardContent className="text-center py-12">
                <div className="flex justify-center mb-4">
                  <CheckCircle size={64} className="text-green-600" />
                </div>
                <h2 className="text-2xl font-bold text-green-900 mb-2">Check-in Successful!</h2>
                <p className="text-green-700 mb-6">Your information has been submitted to the clinic.</p>

                {response.queue_number && (
                  <div className="bg-white rounded-lg p-6 mb-6">
                    <p className="text-sm text-gray-600 mb-2">Your Queue Number</p>
                    <p className="text-5xl font-bold text-primary-600">{response.queue_number}</p>
                    {response.estimated_wait_minutes && (
                      <p className="text-gray-600 mt-4">
                        Estimated wait time: {response.estimated_wait_minutes} minutes
                      </p>
                    )}
                  </div>
                )}

                {response.is_returning_patient && (
                  <div className="bg-blue-100 border border-blue-300 rounded-lg p-4 mb-6 text-blue-900">
                    <p className="font-semibold">Welcome back! We have your previous medical history.</p>
                  </div>
                )}

                <p className="text-gray-600 mb-6">
                  {response.message}
                </p>

                <div className="flex gap-3 justify-center">
                  <Button
                    variant="primary"
                    onClick={() => {
                      setStep('form')
                      setFormData({
                        phone: '',
                        name: '',
                        age: '',
                        gender: '',
                        symptoms: '',
                        medical_history: '',
                        allergies: '',
                        current_medications: '',
                        previous_doctor: '',
                        previous_medication: '',
                        duration_symptoms: '',
                        severity: 'moderate',
                        chronic_conditions: '',
                        past_surgeries: '',
                        consent_ai_triage: false,
                        source: 'web',
                      })
                      setResponse(null)
                    }}
                  >
                    New Check-in
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </Layout>
    )
  }

  return (
    <Layout userRole="patient">
      <div className="max-w-2xl mx-auto">
        <div className="space-y-6">
          {/* Page Header */}
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Patient Check-in</h1>
            <p className="text-gray-600 mt-2">Please provide your information to get started</p>
          </div>

          {/* Error Message */}
          {error && (
            <Card className="border-2 border-red-200 bg-red-50">
              <CardContent className="py-4 flex gap-3">
                <AlertCircle className="text-red-600 flex-shrink-0" size={20} />
                <div>
                  <p className="font-semibold text-red-900">Error submitting check-in</p>
                  <p className="text-red-700 text-sm mt-1">
                    {error instanceof Error ? error.message : 'Please try again'}
                  </p>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit}>
            <Card>
              <CardHeader className="bg-gradient-to-r from-primary-600 to-primary-700 text-white">
                <h2 className="text-xl font-semibold">Personal Information</h2>
              </CardHeader>
              <CardContent className="space-y-6 pt-6">
                {/* Phone and Name Row */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      <Phone size={16} className="inline mr-2" />
                      Phone Number *
                    </label>
                    <input
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      placeholder="+91-98765-43210"
                      required
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      <User size={16} className="inline mr-2" />
                      Full Name *
                    </label>
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      placeholder="John Doe"
                      required
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    />
                  </div>
                </div>

                {/* Age and Gender Row */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Age</label>
                    <input
                      type="number"
                      name="age"
                      value={formData.age}
                      onChange={handleChange}
                      placeholder="35"
                      min="0"
                      max="150"
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Gender</label>
                    <select
                      name="gender"
                      value={formData.gender}
                      onChange={handleChange}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    >
                      <option value="">Select gender</option>
                      <option value="M">Male</option>
                      <option value="F">Female</option>
                      <option value="Other">Other</option>
                    </select>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Current Health */}
            <Card className="mt-6">
              <CardHeader className="bg-gradient-to-r from-primary-600 to-primary-700 text-white">
                <h2 className="text-xl font-semibold">Current Health</h2>
              </CardHeader>
              <CardContent className="space-y-6 pt-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    <AlertCircle size={16} className="inline mr-2" />
                    Symptoms *
                  </label>
                  <textarea
                    name="symptoms"
                    value={formData.symptoms}
                    onChange={handleChange}
                    placeholder="Describe your symptoms (e.g., Fever and cough for 2 days)"
                    required
                    rows={3}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Symptom Severity</label>
                  <select
                    name="severity"
                    value={formData.severity}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  >
                    <option value="mild">Mild</option>
                    <option value="moderate">Moderate</option>
                    <option value="severe">Severe</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">How long have you had these symptoms?</label>
                  <input
                    type="text"
                    name="duration_symptoms"
                    value={formData.duration_symptoms}
                    onChange={handleChange}
                    placeholder="e.g., 2 days, 1 week"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Chronic Conditions</label>
                  <textarea
                    name="chronic_conditions"
                    value={formData.chronic_conditions}
                    onChange={handleChange}
                    placeholder="e.g., Hypertension, Diabetes (optional)"
                    rows={2}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  />
                </div>
              </CardContent>
            </Card>

            {/* Medical History */}
            <Card className="mt-6">
              <CardHeader className="bg-gradient-to-r from-primary-600 to-primary-700 text-white">
                <h2 className="text-xl font-semibold">Medical History</h2>
              </CardHeader>
              <CardContent className="space-y-6 pt-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Allergies</label>
                  <textarea
                    name="allergies"
                    value={formData.allergies}
                    onChange={handleChange}
                    placeholder="e.g., Penicillin, Peanuts (optional)"
                    rows={2}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Current Medications</label>
                  <textarea
                    name="current_medications"
                    value={formData.current_medications}
                    onChange={handleChange}
                    placeholder="e.g., Lisinopril 10mg daily (optional)"
                    rows={2}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Medical History</label>
                  <textarea
                    name="medical_history"
                    value={formData.medical_history}
                    onChange={handleChange}
                    placeholder="e.g., Previous surgeries, hospitalizations (optional)"
                    rows={2}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Past Surgeries</label>
                  <textarea
                    name="past_surgeries"
                    value={formData.past_surgeries}
                    onChange={handleChange}
                    placeholder="e.g., Appendectomy in 2015 (optional)"
                    rows={2}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  />
                </div>
              </CardContent>
            </Card>

            {/* Previous Treatment */}
            <Card className="mt-6">
              <CardHeader className="bg-gradient-to-r from-primary-600 to-primary-700 text-white">
                <h2 className="text-xl font-semibold">Previous Treatment (Optional)</h2>
              </CardHeader>
              <CardContent className="space-y-6 pt-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Previous Doctor</label>
                  <input
                    type="text"
                    name="previous_doctor"
                    value={formData.previous_doctor}
                    onChange={handleChange}
                    placeholder="Name of your regular doctor"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Previous Medication</label>
                  <textarea
                    name="previous_medication"
                    value={formData.previous_medication}
                    onChange={handleChange}
                    placeholder="Medications prescribed previously"
                    rows={2}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  />
                </div>
              </CardContent>
            </Card>

            {/* AI Triage Consent */}
            <Card className="mt-6 border-2 border-blue-200 bg-blue-50">
              <CardContent className="pt-6">
                <label className="flex items-start gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    name="consent_ai_triage"
                    checked={formData.consent_ai_triage}
                    onChange={handleChange}
                    className="w-5 h-5 rounded border-gray-300 text-primary-600 focus:ring-primary-500 mt-1"
                  />
                  <div>
                    <p className="font-semibold text-gray-900">AI-Powered Triage Analysis</p>
                    <p className="text-sm text-gray-600 mt-1">
                      Allow our AI system to analyze your symptoms and provide preliminary assessment before doctor consultation. This helps prioritize cases and reduce wait times.
                    </p>
                  </div>
                </label>
              </CardContent>
            </Card>

            {/* Submit Button */}
            <div className="mt-8 flex gap-3">
              <Button
                type="submit"
                variant="primary"
                size="lg"
                disabled={isLoading}
                className="flex-1"
              >
                {isLoading ? 'Submitting...' : 'Submit Check-in'}
              </Button>
            </div>
          </form>
        </div>
      </div>
    </Layout>
  )
}
