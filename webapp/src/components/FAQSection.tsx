"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import {
  ArrowUp,
  Bot,
  ChevronDown,
  MessageCircle,
  Send,
  Sparkles,
} from "lucide-react";

const faqs = [
  {
    question: "How does the QR appointment system work?",
    answer:
      "Every hospital receives a separate QR code and appointment link. Patients scan the QR, view departments and available doctors from that hospital, then continue with AI-guided or direct appointment booking.",
  },
  {
    question: "Is each hospital's data kept separate?",
    answer:
      "Yes. Each hospital operates inside its own protected workspace. Doctors, patients, appointments, queues, revenue, and records stay separated between hospitals.",
  },
  {
    question: "Can each doctor see every hospital patient?",
    answer:
      "No. Doctors only access patients assigned to them. Hospital administrators access authorized records inside their own hospital.",
  },
  {
    question: "How does AI-guided booking work?",
    answer:
      "The AI collects appointment-related details and helps guide patients toward an appropriate department or available doctor. Patients also have the option to skip AI guidance and book directly.",
  },
  {
    question: "How does the live queue system work?",
    answer:
      "Every doctor has an independent queue. When a consultation is completed, the waiting queue updates for patients assigned to that doctor.",
  },
  {
    question: "Does every hospital receive its own QR code?",
    answer:
      "Yes. Every registered hospital receives a unique QR code and appointment link.",
  },
  {
    question: "Will Hospital H1 see doctors from Hospital H2?",
    answer:
      "No. Hospital QR pages and dashboards show only authorized data from the selected hospital.",
  },
  {
    question: "Can a patient skip AI assistance?",
    answer:
      "Yes. Patients can skip AI guidance and use the normal direct appointment booking flow.",
  },
  {
    question: "What details can patients provide while booking?",
    answer:
      "Patients can provide information such as name, age, contact details, symptoms, known conditions, previous medicine, and previous doctor information where available.",
  },
  {
    question: "Can a hospital administrator manage doctors?",
    answer:
      "Yes. Hospital administrators can manage authorized doctor profiles, appointments, queues, activity, and access status within their hospital.",
  },
  {
    question: "Does each doctor have a separate dashboard?",
    answer:
      "Yes. Each doctor receives an individual dashboard and separate login credentials.",
  },
  {
    question: "Can a hospital administrator view doctor activity?",
    answer:
      "Yes. Hospital administrators can view authorized appointment activity, doctor workload, queues, and patient records inside their hospital.",
  },
  {
    question: "What happens when a doctor is blocked?",
    answer:
      "The doctor's access is removed until an authorized administrator restores the account.",
  },
  {
    question: "What happens when a hospital is blocked?",
    answer:
      "The hospital loses platform access according to the account status configured by the platform administrator.",
  },
  {
    question: "Can the system store patient history?",
    answer:
      "Yes. The platform supports appointment history, consultation records, prescriptions, reports, and other authorized patient information.",
  },
  {
    question: "Does the platform support automated follow-ups?",
    answer:
      "Yes. Hospitals and doctors can manage follow-up reminders, appointment reminders, and patient communication workflows.",
  },
  {
    question: "Will patients receive notifications?",
    answer:
      "Patients can receive appointment confirmations, queue updates, appointment reminders, follow-up reminders, and report notifications.",
  },
  {
    question: "Can doctors receive new appointment notifications?",
    answer:
      "Yes. Doctors can receive notifications for new appointments, queue activity, cancellations, and other relevant updates.",
  },
  {
    question: "Can hospitals track revenue and appointments?",
    answer:
      "Yes. Hospital dashboards support appointment monitoring, patient activity, doctor activity, and revenue tracking.",
  },
  {
    question: "Is there an AI assistant for platform questions?",
    answer:
      "Yes. The MedTech AI Assistant helps visitors understand platform features, hospitals, doctors, QR appointments, live queues, and patient management.",
  },
];

const suggestions = [
  "How does the QR system work?",
  "How is hospital data protected?",
  "What can doctors manage?",
  "How does AI booking work?",
];

type Message = {
  role: "user" | "ai";
  content: string;
};

export default function FAQSection() {
  const [openFAQ, setOpenFAQ] = useState<number | null>(0);
  const [showAll, setShowAll] = useState(false);
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState<Message[]>([
    {
      role: "ai",
      content:
        "Hello. I am the MedTech Fixaters AI Assistant. Ask me about hospitals, doctors, QR appointments, live queues, patient management, or platform features.",
    },
  ]);

  const visibleFAQs = showAll ? faqs : faqs.slice(0, 5);

  const getAIResponse = (question: string) => {
    const lowerQuestion = question.toLowerCase();

    if (
      lowerQuestion.includes("qr") ||
      lowerQuestion.includes("appointment")
    ) {
      return "Each hospital receives a separate QR code and appointment link. Patients who scan it see appointment options connected to that specific hospital.";
    }

    if (
      lowerQuestion.includes("data") ||
      lowerQuestion.includes("security") ||
      lowerQuestion.includes("protected")
    ) {
      return "Hospital workspaces are designed with separate access rules. Each hospital should only access its own authorized doctors, patients, appointments, queues, and records.";
    }

    if (
      lowerQuestion.includes("doctor") &&
      lowerQuestion.includes("manage")
    ) {
      return "Doctors manage their assigned appointments, patient records, consultation details, prescriptions, and individual queues according to their authorized access.";
    }

    if (
      lowerQuestion.includes("ai") ||
      lowerQuestion.includes("booking")
    ) {
      return "Patients can choose AI-guided booking or direct booking. AI-guided booking collects appointment-related details and helps guide the patient toward a suitable department or available doctor.";
    }

    if (
      lowerQuestion.includes("queue") ||
      lowerQuestion.includes("token")
    ) {
      return "Every doctor has an independent live queue. When appointments are completed, the queue updates for patients assigned to that doctor.";
    }

    return "MedTech Fixaters connects hospitals, doctors, and patients through separate dashboards, QR appointment systems, live queues, patient history, notifications, follow-ups, and AI-assisted booking.";
  };

  const sendMessage = (question?: string) => {
    const message = question || input.trim();

    if (!message) return;

    setMessages((current) => [
      ...current,
      {
        role: "user",
        content: message,
      },
    ]);

    setInput("");

    setTimeout(() => {
      setMessages((current) => [
        ...current,
        {
          role: "ai",
          content: getAIResponse(message),
        },
      ]);
    }, 650);
  };

  return (
    <section
      id="faq"
      className="relative overflow-hidden bg-[#f6f7fb] py-24 sm:py-32"
    >
      <FAQBackground />

      <div className="relative mx-auto max-w-7xl px-5 sm:px-8 lg:px-10">
        <SectionHeading />

        <div className="mt-16 grid items-start gap-8 lg:grid-cols-[1.15fr_0.85fr]">
          <FAQList
            openFAQ={openFAQ}
            setOpenFAQ={setOpenFAQ}
            visibleFAQs={visibleFAQs}
            showAll={showAll}
            setShowAll={setShowAll}
          />

          <AIChatbot
            messages={messages}
            input={input}
            setInput={setInput}
            sendMessage={sendMessage}
          />
        </div>
      </div>
    </section>
  );
}

function FAQBackground() {
  return (
    <>
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute left-[-200px] top-[10%] h-[500px] w-[500px] rounded-full bg-blue-300/20 blur-[140px]" />

        <div className="absolute right-[-150px] top-[35%] h-[450px] w-[450px] rounded-full bg-violet-300/20 blur-[140px]" />

        <div className="absolute bottom-[-300px] left-[35%] h-[500px] w-[500px] rounded-full bg-cyan-200/30 blur-[140px]" />
      </div>

      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(255,255,255,0.95),transparent_65%)]" />
    </>
  );
}

function SectionHeading() {
  return (
    <div className="mx-auto max-w-4xl text-center">
      <motion.div
        initial={{
          opacity: 0,
          y: 20,
          filter: "blur(10px)",
        }}
        whileInView={{
          opacity: 1,
          y: 0,
          filter: "blur(0px)",
        }}
        viewport={{ once: true }}
        className="inline-flex items-center gap-2 rounded-full border border-white bg-white/70 px-4 py-2 shadow-2xs backdrop-blur-xl"
      >
        <MessageCircle size={14} className="text-blue-600" />

        <span className="text-[10px] font-bold tracking-[0.18em] text-blue-600">
          FREQUENTLY ASKED QUESTIONS
        </span>
      </motion.div>

      <motion.h2
        initial={{
          opacity: 0,
          y: 30,
          filter: "blur(12px)",
        }}
        whileInView={{
          opacity: 1,
          y: 0,
          filter: "blur(0px)",
        }}
        viewport={{ once: true }}
        transition={{
          duration: 0.7,
          delay: 0.1,
        }}
        className="mt-7 text-4xl font-semibold tracking-[-0.055em] text-[#172033] sm:text-6xl"
      >
        Questions.
        <span className="block text-blue-600">
          Answered.
        </span>
      </motion.h2>

      <motion.p
        initial={{
          opacity: 0,
          y: 20,
        }}
        whileInView={{
          opacity: 1,
          y: 0,
        }}
        viewport={{ once: true }}
        transition={{
          delay: 0.2,
        }}
        className="mx-auto mt-6 max-w-2xl text-base leading-7 text-slate-500 sm:text-lg"
      >
        Learn about hospital management, doctor access, QR appointments,
        AI-guided booking, live queues, patient history, notifications,
        and platform security.
      </motion.p>
    </div>
  );
}

function FAQList({
  openFAQ,
  setOpenFAQ,
  visibleFAQs,
  showAll,
  setShowAll,
}: {
  openFAQ: number | null;
  setOpenFAQ: (index: number | null) => void;
  visibleFAQs: typeof faqs;
  showAll: boolean;
  setShowAll: (value: boolean) => void;
}) {
  return (
    <div>
      <div className="space-y-3">
        {visibleFAQs.map((faq, index) => {
          const isOpen = openFAQ === index;

          return (
            <motion.div
              key={faq.question}
              layout
              initial={{
                opacity: 0,
                y: 20,
                filter: "blur(8px)",
              }}
              whileInView={{
                opacity: 1,
                y: 0,
                filter: "blur(0px)",
              }}
              viewport={{ once: true }}
              transition={{
                duration: 0.45,
                delay: Math.min(index * 0.05, 0.3),
              }}
              className={`overflow-hidden rounded-[24px] border transition-all duration-300 ${
                isOpen
                  ? "border-blue-100 bg-white/90 shadow-[0_20px_60px_rgba(37,99,235,0.08)]"
                  : "border-white bg-white/60"
              } backdrop-blur-xl text-left`}
            >
              <button
                onClick={() =>
                  setOpenFAQ(isOpen ? null : index)
                }
                className="flex w-full items-center gap-4 sm:gap-5 px-5 sm:px-6 py-5 text-left cursor-pointer"
              >
                <div
                  className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-xl text-[10px] font-bold transition-colors ${
                    isOpen
                      ? "bg-blue-600 text-white"
                      : "bg-slate-100 text-slate-400"
                  }`}
                >
                  {String(index + 1).padStart(2, "0")}
                </div>

                <span className="flex-1 text-sm font-semibold text-[#172033] sm:text-base">
                  {faq.question}
                </span>

                <motion.div
                  animate={{
                    rotate: isOpen ? 180 : 0,
                  }}
                  transition={{
                    duration: 0.3,
                  }}
                  className={`flex h-9 w-9 items-center justify-center rounded-full ${
                    isOpen
                      ? "bg-blue-50 text-blue-600"
                      : "text-slate-400"
                  }`}
                >
                  <ChevronDown size={18} />
                </motion.div>
              </button>

              <AnimatePresence initial={false}>
                {isOpen && (
                  <motion.div
                    initial={{
                      height: 0,
                      opacity: 0,
                    }}
                    animate={{
                      height: "auto",
                      opacity: 1,
                    }}
                    exit={{
                      height: 0,
                      opacity: 0,
                    }}
                    transition={{
                      duration: 0.35,
                    }}
                  >
                    <div className="border-t border-slate-100 px-6 pb-6 pt-5 pl-5 sm:pl-[4.8rem]">
                      <p className="max-w-2xl text-sm leading-7 text-slate-500">
                        {faq.answer}
                      </p>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          );
        })}
      </div>

      <motion.div
        layout
        className="mt-8 flex justify-center"
      >
        <button
          onClick={() => setShowAll(!showAll)}
          className="group inline-flex items-center gap-3 rounded-full border border-slate-200 bg-white px-6 py-3.5 text-sm font-semibold text-[#172033] shadow-2xs transition-all duration-300 hover:border-blue-200 hover:bg-blue-50 hover:text-blue-600 cursor-pointer"
        >
          {showAll
            ? "Show Less"
            : "View All 20 Questions"}

          <motion.span
            animate={{
              rotate: showAll ? 180 : 0,
            }}
          >
            <ChevronDown
              size={17}
              className="transition-transform"
            />
          </motion.span>
        </button>
      </motion.div>
    </div>
  );
}

function AIChatbot({
  messages,
  input,
  setInput,
  sendMessage,
}: {
  messages: Message[];
  input: string;
  setInput: (value: string) => void;
  sendMessage: (message?: string) => void;
}) {
  return (
    <motion.div
      initial={{
        opacity: 0,
        x: 40,
        filter: "blur(15px)",
      }}
      whileInView={{
        opacity: 1,
        x: 0,
        filter: "blur(0px)",
      }}
      viewport={{ once: true }}
      transition={{
        duration: 0.8,
        type: "spring",
        stiffness: 70,
      }}
      className="sticky top-24 text-left"
    >
      <div className="relative overflow-hidden rounded-[32px] border border-white bg-white/70 shadow-[0_30px_100px_rgba(15,23,42,0.1)] backdrop-blur-2xl">
        <div className="absolute left-1/2 top-[-100px] h-[220px] w-[220px] -translate-x-1/2 rounded-full bg-blue-400/20 blur-[80px]" />

        <ChatHeader />

        <ChatMessages messages={messages} />

        <SuggestionButtons sendMessage={sendMessage} />

        <ChatInput
          input={input}
          setInput={setInput}
          sendMessage={sendMessage}
        />
      </div>
    </motion.div>
  );
}

function ChatHeader() {
  return (
    <div className="relative border-b border-slate-100 px-6 py-5">
      <div className="flex items-center gap-3">
        <motion.div
          animate={{
            rotate: [0, 6, -6, 0],
          }}
          transition={{
            duration: 4,
            repeat: Infinity,
          }}
          className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-blue-600 to-violet-600 text-white shadow-lg shadow-blue-500/20"
        >
          <Bot size={22} />
        </motion.div>

        <div className="flex-1">
          <div className="flex items-center gap-2">
            <h3 className="text-sm font-semibold text-[#172033]">
              MedTech AI
            </h3>

            <span className="flex items-center gap-1.5 rounded-full bg-emerald-50 px-2 py-1">
              <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-emerald-500" />

              <span className="text-[8px] font-bold text-emerald-600">
                ONLINE
              </span>
            </span>
          </div>

          <p className="mt-1 text-[10px] text-slate-400">
            Platform Assistant
          </p>
        </div>
      </div>
    </div>
  );
}

function ChatMessages({
  messages,
}: {
  messages: Message[];
}) {
  return (
    <div className="relative max-h-[340px] min-h-[300px] space-y-4 overflow-y-auto px-5 py-6">
      <AnimatePresence initial={false}>
        {messages.map((message, index) => (
          <motion.div
            key={`${message.content}-${index}`}
            initial={{
              opacity: 0,
              y: 12,
              scale: 0.97,
            }}
            animate={{
              opacity: 1,
              y: 0,
              scale: 1,
            }}
            transition={{
              duration: 0.35,
            }}
            className={`flex ${
              message.role === "user"
                ? "justify-end"
                : "justify-start"
            }`}
          >
            {message.role === "ai" && (
              <div className="mr-2 mt-1 flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-blue-50 text-blue-600">
                <Bot size={13} />
              </div>
            )}

            <div
              className={`max-w-[80%] rounded-[20px] px-4 py-3 text-xs leading-6 ${
                message.role === "user"
                  ? "rounded-br-md bg-blue-600 text-white shadow-lg shadow-blue-500/15"
                  : "rounded-bl-md border border-slate-100 bg-white text-slate-600 shadow-2xs"
              }`}
            >
              {message.content}
            </div>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
}

function SuggestionButtons({
  sendMessage,
}: {
  sendMessage: (message: string) => void;
}) {
  return (
    <div className="border-t border-slate-100 px-5 py-4">
      <p className="mb-3 text-[9px] font-bold uppercase tracking-[0.15em] text-slate-400">
        Suggested Questions
      </p>

      <div className="flex flex-wrap gap-2">
        {suggestions.map((suggestion) => (
          <button
            key={suggestion}
            onClick={() => sendMessage(suggestion)}
            className="rounded-full border border-slate-200 bg-white px-3 py-2 text-[9px] font-medium text-slate-600 transition-all duration-300 hover:border-blue-200 hover:bg-blue-50 hover:text-blue-600 cursor-pointer"
          >
            {suggestion}
          </button>
        ))}
      </div>
    </div>
  );
}

function ChatInput({
  input,
  setInput,
  sendMessage,
}: {
  input: string;
  setInput: (value: string) => void;
  sendMessage: () => void;
}) {
  return (
    <div className="border-t border-slate-100 p-5">
      <div className="flex items-center gap-2 rounded-2xl border border-slate-200 bg-slate-50 p-2 transition-all focus-within:border-blue-300 focus-within:bg-white focus-within:shadow-[0_0_0_4px_rgba(37,99,235,0.06)]">
        <input
          value={input}
          onChange={(event) => setInput(event.target.value)}
          onKeyDown={(event) => {
            if (event.key === "Enter") {
              sendMessage();
            }
          }}
          placeholder="Ask about the platform..."
          className="min-w-0 flex-1 bg-transparent px-3 text-xs text-[#172033] outline-none placeholder:text-slate-400"
        />

        <button
          onClick={() => sendMessage()}
          className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-blue-600 text-white shadow-lg shadow-blue-500/20 transition-transform duration-200 hover:scale-105 active:scale-95 cursor-pointer"
          aria-label="Send message"
        >
          <Send size={16} />
        </button>
      </div>

      <div className="mt-3 flex items-center justify-center gap-2">
        <Sparkles size={11} className="text-blue-500" />

        <p className="text-[9px] text-slate-400">
          AI answers questions about MedTech Fixaters features.
        </p>
      </div>
    </div>
  );
}
