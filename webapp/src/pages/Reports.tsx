import { BarChart, TrendingUp, Calendar } from 'lucide-react'
import Layout from '../components/Layout'
import { Card, CardContent, CardHeader } from '../components/Card'
import Button from '../components/Button'

export default function Reports() {
  return (
    <Layout userRole="doctor">
      <div className="space-y-6">
        {/* Page Header */}
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Reports & Analytics</h1>
          <p className="text-gray-600 mt-2">View clinic performance and patient insights</p>
        </div>

        {/* Date Range Selector */}
        <Card>
          <CardContent className="py-4 flex gap-3 items-center">
            <Calendar size={20} className="text-primary-600" />
            <div className="flex-1">
              <label className="block text-sm font-medium text-gray-700 mb-2">Report Period</label>
              <div className="flex gap-2">
                <input
                  type="date"
                  defaultValue={new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]}
                  className="px-3 py-2 border border-gray-300 rounded-lg text-sm"
                />
                <span className="flex items-center text-gray-500">to</span>
                <input
                  type="date"
                  defaultValue={new Date().toISOString().split('T')[0]}
                  className="px-3 py-2 border border-gray-300 rounded-lg text-sm"
                />
                <Button variant="primary">Generate Report</Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Key Metrics */}
        <div className="grid grid-cols-4 gap-4">
          <Card>
            <CardContent className="py-6">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-sm text-gray-600">Total Check-ins</p>
                  <p className="text-3xl font-bold text-gray-900 mt-2">248</p>
                  <p className="text-xs text-green-600 mt-2">↑ 12% from last period</p>
                </div>
                <BarChart className="text-primary-600" size={24} />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="py-6">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-sm text-gray-600">Appointments</p>
                  <p className="text-3xl font-bold text-gray-900 mt-2">186</p>
                  <p className="text-xs text-green-600 mt-2">↑ 8% completion rate</p>
                </div>
                <TrendingUp className="text-primary-600" size={24} />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="py-6">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-sm text-gray-600">No-shows</p>
                  <p className="text-3xl font-bold text-red-600 mt-2">12</p>
                  <p className="text-xs text-red-600 mt-2">4.8% rate</p>
                </div>
                <BarChart className="text-red-600" size={24} />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="py-6">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-sm text-gray-600">Avg. Wait Time</p>
                  <p className="text-3xl font-bold text-blue-600 mt-2">8.5 min</p>
                  <p className="text-xs text-green-600 mt-2">↓ 15% improvement</p>
                </div>
                <Calendar className="text-blue-600" size={24} />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Report Sections */}
        <div className="grid grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <h3 className="text-lg font-semibold text-gray-900">Symptom Distribution</h3>
            </CardHeader>
            <CardContent className="py-6">
              <div className="space-y-3">
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-gray-700">Fever</span>
                    <span className="font-semibold">35%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div className="bg-red-500 h-2 rounded-full" style={{ width: '35%' }} />
                  </div>
                </div>
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-gray-700">Cough</span>
                    <span className="font-semibold">28%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div className="bg-yellow-500 h-2 rounded-full" style={{ width: '28%' }} />
                  </div>
                </div>
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-gray-700">Headache</span>
                    <span className="font-semibold">18%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div className="bg-blue-500 h-2 rounded-full" style={{ width: '18%' }} />
                  </div>
                </div>
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-gray-700">Others</span>
                    <span className="font-semibold">19%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div className="bg-gray-500 h-2 rounded-full" style={{ width: '19%' }} />
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <h3 className="text-lg font-semibold text-gray-900">Severity Distribution</h3>
            </CardHeader>
            <CardContent className="py-6">
              <div className="space-y-3">
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-gray-700">Mild</span>
                    <span className="font-semibold">52%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div className="bg-blue-500 h-2 rounded-full" style={{ width: '52%' }} />
                  </div>
                </div>
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-gray-700">Moderate</span>
                    <span className="font-semibold">35%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div className="bg-yellow-500 h-2 rounded-full" style={{ width: '35%' }} />
                  </div>
                </div>
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-gray-700">Severe</span>
                    <span className="font-semibold">13%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div className="bg-red-500 h-2 rounded-full" style={{ width: '13%' }} />
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <h3 className="text-lg font-semibold text-gray-900">Hourly Patient Traffic</h3>
            </CardHeader>
            <CardContent className="py-6">
              <div className="space-y-2">
                <div className="flex items-end gap-2 h-48">
                  {[12, 18, 25, 32, 28, 35, 22, 15, 10].map((value, i) => (
                    <div key={i} className="flex-1 flex flex-col items-center">
                      <div className="w-full bg-primary-500 rounded-t" style={{ height: `${(value / 35) * 100}%` }} />
                      <span className="text-xs text-gray-600 mt-2">{9 + i}AM</span>
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <h3 className="text-lg font-semibold text-gray-900">Doctor Performance</h3>
            </CardHeader>
            <CardContent className="py-6">
              <div className="space-y-4">
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-gray-700">Dr. Smith</span>
                    <span className="font-semibold">45 patients</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div className="bg-green-500 h-2 rounded-full" style={{ width: '90%' }} />
                  </div>
                </div>
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-gray-700">Dr. Johnson</span>
                    <span className="font-semibold">38 patients</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div className="bg-green-500 h-2 rounded-full" style={{ width: '76%' }} />
                  </div>
                </div>
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-gray-700">Dr. Patel</span>
                    <span className="font-semibold">32 patients</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div className="bg-green-500 h-2 rounded-full" style={{ width: '64%' }} />
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Export Button */}
        <div className="flex gap-3 justify-end">
          <Button variant="secondary">Download PDF</Button>
          <Button variant="primary">Send to Email</Button>
        </div>
      </div>
    </Layout>
  )
}
