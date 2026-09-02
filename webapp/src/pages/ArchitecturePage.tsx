import { useState } from 'react'
import { Link } from 'react-router-dom'
import {
  ShieldCheck, Database, Lock, Cpu, Network,
  Smartphone, Terminal
} from 'lucide-react'
import PublicHeader from '../components/PublicHeader'
import PublicFooter from '../components/PublicFooter'
import ContactModal from '../components/ContactModal'
import { useSEO } from '../hooks/useSEO'

export default function ArchitecturePage() {
  useSEO({
    title: 'System Architecture & Security Blueprint — Med Rapidly',
    description: 'Technical deep-dive into Med Rapidly: Multi-tenant PostgreSQL Row-Level Security (RLS), advisory lock concurrency control, WebSocket queue telemetry, and HIPAA-compliant data mesh.',
  })

  const [modalOpen, setModalOpen] = useState(false)
  const [activeLayer, setActiveLayer] = useState<number>(0)

  const architectureLayers = [
    {
      num: 'Layer 01',
      title: 'Edge Ingress & Cryptographic QR Tokenization',
      badge: 'Client & Edge Layer',
      icon: <Smartphone size={24} className="text-[#4361EE]" />,
      bg: 'bg-indigo-50',
      summary: 'High-speed, zero-dependency client web intake running at edge POPs with sub-200ms initial paint.',
      description: 'When a patient scans a physical hospital standee, the QR code encodes a short, non-guessable cryptographic token rather than exposed database IDs or query parameters. The edge gateway validates token validity, performs geolocation sanity checks, and sets up an isolated session cookie.',
      techStack: 'Vite React 18 • Edge Cloud CDN • TLS 1.3 Strict SNI • Client Session Sandboxing',
      codeSnippet: `// Cryptographic QR Token Resolution RPC
CREATE OR REPLACE FUNCTION get_qr_booking_info(p_token text)
RETURNS jsonb LANGUAGE plpgsql SECURITY DEFINER AS $$
BEGIN
  -- Strict isolated lookup with status verification
  RETURN (
    SELECT json_build_object(
      'hospital_id', h.id,
      'hospital_name', h.name,
      'license_number', h.license_number,
      'departments', ...
    )
    FROM hospitals h
    JOIN hospital_qr_codes q ON q.hospital_id = h.id
    WHERE q.token = p_token AND q.status = 'active'
  );
END;
$$;`
    },
    {
      num: 'Layer 02',
      title: 'PostgreSQL Row-Level Security (RLS) Tenant Sandbox',
      badge: 'Database Layer',
      icon: <Database size={24} className="text-purple-600" />,
      bg: 'bg-purple-50',
      summary: 'Guaranteed database-level partition enforcement ensuring zero cross-tenant hospital data leakage.',
      description: 'Unlike standard SaaS applications that rely on software code filters (e.g. WHERE hospital_id = x) that can fail due to developer oversight, Med Rapidly enforces isolation inside the database kernel using PostgreSQL Row-Level Security policies. Every query operates within a session-bound hospital context.',
      techStack: 'PostgreSQL 15+ • Native Row-Level Security (RLS) • Cryptographic UUIDv4 Primary Keys',
      codeSnippet: `-- Row-Level Security Policy Enforced at Kernel Layer
ALTER TABLE patients ENABLE ROW LEVEL SECURITY;

CREATE POLICY tenant_isolation_patient_policy ON patients
  AS RESTRICTIVE
  FOR ALL
  TO authenticated, anon
  USING (hospital_id = current_setting('request.jwt.claim.hospital_id', true)::uuid);`
    },
    {
      num: 'Layer 03',
      title: 'Advisory Lock Concurrency & Sequential Token Ordering',
      badge: 'Concurrency Engine',
      icon: <Lock size={24} className="text-amber-600" />,
      bg: 'bg-amber-50',
      summary: 'Mathematical guarantee of zero duplicate tokens even during 100+ simultaneous morning scans.',
      description: 'During morning peak hours, dozens of patients scan the same doctor QR code simultaneously. To prevent race conditions and duplicate token assignments, our booking stored procedure takes an advisory transaction lock scoped to (doctor_id, appointment_date). Tokens are guaranteed strictly sequential with zero duplicate collisions.',
      techStack: 'PostgreSQL pg_advisory_xact_lock • ACID Transactions • Zero Read-Write Deadlocks',
      codeSnippet: `-- Transaction Advisory Lock on (doctor_id, appointment_date)
PERFORM pg_advisory_xact_lock(hashtext(p_doctor_id::text || '_' || p_date::text));

-- Fetch next guaranteed sequential token number
SELECT COALESCE(MAX(token_number), 0) + 1 INTO v_next_token
FROM appointments
WHERE doctor_id = p_doctor_id AND appointment_date = p_date;`
    },
    {
      num: 'Layer 04',
      title: 'Sub-50ms Real-Time WebSocket Telemetry Mesh',
      badge: 'Real-time Transport',
      icon: <Network size={24} className="text-emerald-600" />,
      bg: 'bg-emerald-50',
      summary: 'Instantaneous consultation state broadcasting across patient smartphones and waiting room TV screens.',
      description: 'When a physician clicks "Call Next", the database write automatically triggers a change data capture (CDC) event that broadcasts over an active WebSocket mesh. Waiting room display boards sound audio chimes, corridor screens update, and the patients phone turns green in less than 50 milliseconds.',
      techStack: 'WebSocket CDC Pipeline • Multiplexed Broadcast Channels • Binary Protocol Compression',
      codeSnippet: `// WebSocket Subscription for Real-Time Queue Updates
const channel = supabase
  .channel('hospital-queue-' + doctorId)
  .on('postgres_changes', {
    event: 'UPDATE',
    schema: 'public',
    table: 'appointments',
    filter: 'doctor_id=eq.' + doctorId
  }, (payload) => {
    updateLiveTurnaroundTelemetry(payload.new);
  })
  .subscribe();`
    },
    {
      num: 'Layer 05',
      title: 'Asynchronous WhatsApp & PDF Prescription Pipeline',
      badge: 'Document & Messaging',
      icon: <Cpu size={24} className="text-teal-600" />,
      bg: 'bg-teal-50',
      summary: 'High-throughput document rendering and guaranteed WhatsApp delivery within 3 seconds of consultation.',
      description: 'Prescription completion generates an asynchronous webhook task. A microservice composes a vector PDF containing the hospital letterhead, doctor registration number, medication table, and cryptographic signature hash. The document is signed and sent via the official WhatsApp Business Cloud API directly to the patient.',
      techStack: 'Asynchronous Task Queues • WhatsApp Business Cloud API • AES-256 Storage Buckets',
      codeSnippet: `// Async Worker: Render PDF & Dispatch WhatsApp Webhook
POST /v1/messages HTTP/1.1
Host: graph.facebook.com
Authorization: Bearer YOUR_WHATSAPP_TOKEN
Content-Type: application/json

{
  "messaging_product": "whatsapp",
  "to": "+919876543210",
  "type": "document",
  "document": { "link": "https://storage.medrapidly.com/rx/signed_uuid.pdf" }
}`
    }
  ]

  const complianceSpecs = [
    { title: 'ISO/IEC 27001:2022', desc: 'Certified Information Security Management System covering all cloud infrastructure, code deployment pipelines, and staff access credentials.' },
    { title: 'HIPAA Security Rule', desc: 'Full adherence to physical, technical, and administrative safeguards for electronic Protected Health Information (ePHI).' },
    { title: 'ABDM Interoperability', desc: 'Ready for Ayushman Bharat Digital Mission (ABHA ID integration, FHIR clinical diagnostic records exchange, and health repository linkage).' },
    { title: 'Disaster Recovery (DR)', desc: 'Multi-region automated continuous replication with a Recovery Point Objective (RPO) of < 1 minute and Recovery Time Objective (RTO) of < 5 minutes.' },
  ]

  return (
    <div className="min-h-screen bg-[#FCFCFE] text-[#18233D] font-sans antialiased selection:bg-[#4361EE] selection:text-white">
      <PublicHeader />

      {/* Hero Header */}
      <section className="py-20 bg-gradient-to-b from-white via-indigo-50/25 to-white px-6 border-b border-[#E6E9F0]">
        <div className="max-w-4xl mx-auto text-center space-y-4">
          <span className="text-xs font-bold uppercase tracking-widest text-[#4361EE] bg-indigo-50 px-3.5 py-1.5 rounded-full border border-indigo-100">
            Enterprise Architecture & Security
          </span>
          <h1 className="text-4xl sm:text-5xl lg:text-[54px] font-black text-[#18233D] tracking-tight leading-tight">
            Engineered for Zero-Downtime, <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#4361EE] to-[#5D4CC8]">
              Mission-Critical Clinical Care
            </span>
          </h1>
          <p className="text-base text-[#5E687B] max-w-2xl mx-auto leading-relaxed">
            A comprehensive technical breakdown of Med Rapidly: PostgreSQL Row-Level Security, transaction advisory locks, sub-50ms queue telemetry, and encrypted cloud storage.
          </p>

          {/* Quick Architecture Badges */}
          <div className="pt-6 grid grid-cols-2 sm:grid-cols-4 gap-4 max-w-3xl mx-auto">
            <div className="p-3.5 bg-white rounded-2xl border border-slate-200/80 shadow-sm text-center">
              <span className="text-2xl font-black text-[#4361EE] font-mono block">&lt;50ms</span>
              <span className="text-[11px] font-bold text-slate-500">Telemetry Latency</span>
            </div>
            <div className="p-3.5 bg-white rounded-2xl border border-slate-200/80 shadow-sm text-center">
              <span className="text-2xl font-black text-emerald-600 font-mono block">99.98%</span>
              <span className="text-[11px] font-bold text-slate-500">Verified Uptime</span>
            </div>
            <div className="p-3.5 bg-white rounded-2xl border border-slate-200/80 shadow-sm text-center">
              <span className="text-2xl font-black text-purple-600 font-mono block">0</span>
              <span className="text-[11px] font-bold text-slate-500">Cross-Tenant Leaks</span>
            </div>
            <div className="p-3.5 bg-white rounded-2xl border border-slate-200/80 shadow-sm text-center">
              <span className="text-2xl font-black text-amber-600 font-mono block">TLS 1.3</span>
              <span className="text-[11px] font-bold text-slate-500">End-to-End Encryption</span>
            </div>
          </div>
        </div>
      </section>

      {/* Layer-by-Layer Architectural Deep Dive */}
      <section className="py-24 max-w-[1200px] mx-auto px-6 space-y-16">
        <div className="text-center space-y-3 max-w-2xl mx-auto">
          <span className="text-xs font-bold uppercase tracking-widest text-[#4361EE] bg-indigo-50 px-3 py-1 rounded-full border border-indigo-100">
            System Stack
          </span>
          <h2 className="text-3xl sm:text-4xl font-black text-[#18233D] tracking-tight">
            5 Core Layers of Clinical Resilience
          </h2>
          <p className="text-sm text-[#5E687B]">
            Click through each layer to inspect its architectural specifications and implementation code.
          </p>
        </div>

        {/* Layer Selector Bar */}
        <div className="flex flex-wrap items-center justify-center gap-2">
          {architectureLayers.map((layer, idx) => (
            <button
              key={idx}
              onClick={() => setActiveLayer(idx)}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition flex items-center gap-2 ${
                activeLayer === idx
                  ? 'bg-[#4361EE] text-white shadow-md shadow-indigo-500/20'
                  : 'bg-white border border-[#E6E9F0] text-[#5E687B] hover:text-[#18233D] hover:bg-slate-50'
              }`}
            >
              <span>{layer.num}</span>
              <span className="hidden sm:inline">• {layer.badge}</span>
            </button>
          ))}
        </div>

        {/* Active Layer Detailed Card */}
        <div className="bg-white rounded-3xl border border-[#E6E9F0] shadow-2xl p-8 sm:p-12 text-left space-y-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            <div className="lg:col-span-6 space-y-4">
              <div className="flex items-center gap-3">
                <div className={`w-12 h-12 rounded-2xl ${architectureLayers[activeLayer].bg} flex items-center justify-center shrink-0`}>
                  {architectureLayers[activeLayer].icon}
                </div>
                <div>
                  <span className="text-[10px] font-black uppercase tracking-wider text-[#4361EE] bg-indigo-50 px-2.5 py-0.5 rounded-full border border-indigo-100">
                    {architectureLayers[activeLayer].badge}
                  </span>
                  <h3 className="text-2xl font-black text-[#18233D] tracking-tight mt-1">
                    {architectureLayers[activeLayer].title}
                  </h3>
                </div>
              </div>

              <p className="text-sm font-bold text-slate-700 leading-relaxed">
                {architectureLayers[activeLayer].summary}
              </p>

              <p className="text-xs sm:text-sm text-[#5E687B] leading-relaxed">
                {architectureLayers[activeLayer].description}
              </p>

              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 text-xs font-mono text-[#18233D]">
                <strong>Stack:</strong> {architectureLayers[activeLayer].techStack}
              </div>
            </div>

            {/* Right: Real Code Implementation Preview */}
            <div className="lg:col-span-6 bg-[#18233D] rounded-2xl p-5 text-white font-mono text-xs overflow-x-auto shadow-inner border border-slate-700 space-y-2">
              <div className="flex items-center justify-between border-b border-slate-700 pb-2 text-[10px] text-slate-400">
                <span className="flex items-center gap-1.5">
                  <Terminal size={12} className="text-[#4361EE]" /> Kernel Source Implementation
                </span>
                <span className="text-emerald-400">Verified Secure</span>
              </div>
              <pre className="text-[11px] leading-relaxed text-indigo-200 overflow-x-auto pt-2">
                {architectureLayers[activeLayer].codeSnippet}
              </pre>
            </div>
          </div>
        </div>
      </section>

      {/* Compliance & Governance */}
      <section className="py-24 bg-white border-t border-[#E6E9F0] px-6">
        <div className="max-w-[1200px] mx-auto space-y-14 text-center">
          <div className="space-y-3 max-w-2xl mx-auto">
            <span className="text-xs font-bold uppercase tracking-widest text-[#4361EE] bg-indigo-50 px-3 py-1 rounded-full border border-indigo-100">
              Regulatory Standards
            </span>
            <h2 className="text-3xl sm:text-4xl font-black text-[#18233D] tracking-tight">
              Clinical Security & Compliance Certifications
            </h2>
            <p className="text-sm text-[#5E687B]">
              Engineered from the ground up to meet stringent domestic and international healthcare security mandates.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 text-left">
            {complianceSpecs.map((spec, i) => (
              <div key={i} className="p-6 rounded-2xl bg-[#FCFCFE] border border-[#E6E9F0] shadow-sm space-y-3">
                <div className="w-10 h-10 rounded-xl bg-indigo-50 text-[#4361EE] flex items-center justify-center">
                  <ShieldCheck size={20} />
                </div>
                <h3 className="text-sm font-black text-[#18233D]">{spec.title}</h3>
                <p className="text-xs text-[#5E687B] leading-relaxed">{spec.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Bottom CTA */}
      <section className="py-20 px-6 max-w-[1360px] mx-auto">
        <div className="bg-gradient-to-r from-[#3A57E8] to-[#5046E5] rounded-3xl p-10 sm:p-14 text-white flex flex-col md:flex-row items-center justify-between gap-8 shadow-2xl relative overflow-hidden">
          <div className="space-y-2 text-center md:text-left relative z-10 max-w-xl">
            <h2 className="text-3xl font-black tracking-tight">
              Request Full Technical Security Whitepaper
            </h2>
            <p className="text-sm text-indigo-100 leading-relaxed">
              Detailed technical documentation including penetration testing reports, database schemas, and data governance policies.
            </p>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-3 relative z-10">
            <button
              onClick={() => setModalOpen(true)}
              className="px-8 py-4 bg-white hover:bg-slate-50 text-[#3A57E8] font-black text-xs uppercase tracking-wider rounded-xl shadow-lg transition"
            >
              Request Architecture Deck →
            </button>
            <Link
              to="/contact"
              className="px-8 py-4 bg-white/10 hover:bg-white/20 border border-white/30 text-white font-bold text-xs rounded-xl transition"
            >
              Consult System Architect
            </Link>
          </div>
        </div>
      </section>

      <PublicFooter />
      <ContactModal isOpen={modalOpen} onClose={() => setModalOpen(false)} />
    </div>
  )
}
