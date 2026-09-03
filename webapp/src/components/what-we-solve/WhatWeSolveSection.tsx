import { motion } from "framer-motion";
import SectionHeading from "./SectionHeading";
import ProblemCard from "./ProblemCard";

import DisconnectedWorkflowVisual from "./DisconnectedWorkflowVisual";
import QueueProblemVisual from "./QueueProblemVisual";
import DoctorActivityVisual from "./DoctorActivityVisual";
import VisibilityVisual from "./VisibilityVisual";

const problems = [
  {
    number: "01",
    title: "Disconnected Workflows",
    description:
      "MedTech AI helps connect information across appointments, doctors, patients, records, and hospital workflows.",
    visual: <DisconnectedWorkflowVisual />,
  },
  {
    number: "02",
    title: "Long Patient Queues",
    description:
      "AI-supported queue intelligence helps keep patients informed with live appointment progress, queue movement, and waiting updates.",
    visual: <QueueProblemVisual />,
  },
  {
    number: "03",
    title: "Scattered Doctor Activity",
    description:
      "AI-powered operational visibility helps hospital teams understand doctor availability, appointment activity, patient flow, and workload from one connected system.",
    visual: <DoctorActivityVisual />,
  },
  {
    number: "04",
    title: "Limited Operational Visibility",
    description:
      "MedTech AI turns hospital activity into organized insights, helping teams track appointments, patients, consultations, and daily operations from one intelligent workspace.",
    visual: <VisibilityVisual />,
  },
];

export default function WhatWeSolveSection() {
  return (
    <section className="relative overflow-hidden bg-gradient-to-b from-[#FAFBFD] via-[#F4F6FB] to-[#FAFBFD] px-4 py-20 sm:px-6 md:py-28 lg:px-8 text-center">
      {/* Background Soft Glows */}
      <div className="pointer-events-none absolute left-1/4 top-10 h-[450px] w-[550px] rounded-full bg-blue-400/5 blur-[120px]" />
      <div className="pointer-events-none absolute right-1/4 bottom-10 h-[450px] w-[550px] rounded-full bg-orange-400/5 blur-[120px]" />

      <div className="relative mx-auto max-w-6xl">
        <SectionHeading />

        <motion.div
          className="mt-14 grid gap-6 md:grid-cols-2 lg:mt-16"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.15 }}
          variants={{
            hidden: {},
            visible: {
              transition: {
                staggerChildren: 0.12,
              },
            },
          }}
        >
          {problems.map((problem) => (
            <ProblemCard
              key={problem.number}
              number={problem.number}
              title={problem.title}
              description={problem.description}
            >
              {problem.visual}
            </ProblemCard>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
