import React, { useState } from 'react';
import { ChevronDown, ChevronUp, HelpCircle } from 'lucide-react';
import { FAQS } from '../data';
import { motion, AnimatePresence } from 'motion/react';

export default function FaqSection() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const toggleOpen = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <div className="space-y-4" id="faq-section-container">
      <div className="flex items-center gap-2">
        <HelpCircle className="h-5 w-5 text-indigo-400" />
        <h2 className="text-lg font-bold text-white font-sans">Frequently Asked Questions</h2>
      </div>

      <div className="space-y-3" id="faq-accordion-list">
        {FAQS.map((faq, index) => {
          const isOpen = openIndex === index;
          return (
            <div
              key={index}
              className="rounded-xl border border-slate-800 bg-slate-900 overflow-hidden transition-colors hover:border-slate-700"
            >
              <button
                onClick={() => toggleOpen(index)}
                className="w-full flex items-center justify-between p-4 text-left text-xs font-bold text-white hover:text-indigo-400 transition-colors focus:outline-none"
                id={`faq-btn-${index}`}
              >
                <span>{faq.question}</span>
                {isOpen ? (
                  <ChevronUp className="h-4 w-4 text-indigo-400 shrink-0" />
                ) : (
                  <ChevronDown className="h-4 w-4 text-slate-500 shrink-0" />
                )}
              </button>

              <AnimatePresence>
                {isOpen && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.2 }}
                  >
                    <div className="p-4 pt-0 border-t border-slate-850 text-xs text-slate-400 leading-relaxed bg-slate-950/40">
                      {faq.answer}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          );
        })}
      </div>
    </div>
  );
}
