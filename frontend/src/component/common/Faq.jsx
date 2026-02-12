import { useState } from "react";
import { ChevronDown, HelpCircle } from "lucide-react";

const faqData = [
  {
    question: "How do I place an order?",
    answer:
      "Browse products, add them to your cart, proceed to checkout, and confirm your payment to place an order.",
  },
  {
    question: "How can I track my order?",
    answer:
      "Go to the My Orders section in your dashboard to see real-time order updates.",
  },
  {
    question: "What payment methods are accepted?",
    answer:
      "We accept UPI, debit/credit cards, net banking, and cash on delivery (if available).",
  },
  {
    question: "Can I return a product?",
    answer:
      "Yes, products can be returned within 7 days of delivery if they meet our return policy.",
  },
  {
    question: "Is my payment information secure?",
    answer:
      "Yes, Shopora uses secure encryption and authentication methods to protect your data.",
  },
];

const FAQ = () => {
  const [activeIndex, setActiveIndex] = useState(null);

  const toggleFAQ = (index) => {
    setActiveIndex(activeIndex === index ? null : index);
  };

  return (
    <section className="min-h-screen bg-gradient-to-br from-violet-50 via-purple-50 to-fuchsia-50 px-4 py-20">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-violet-100 rounded-full mb-6">
            <HelpCircle className="w-8 h-8 text-violet-600" />
          </div>
          <h2 className="text-5xl font-bold bg-gradient-to-r from-violet-600 via-purple-600 to-fuchsia-600 bg-clip-text text-transparent mb-4">
            Frequently Asked Questions
          </h2>
          <p className="text-gray-600 text-lg">
            Find answers to common questions about Shopora
          </p>
        </div>

        {/* FAQ Items */}
        <div className="space-y-5">
          {faqData.map((item, index) => (
            <div
              key={index}
              className={`group relative backdrop-blur-sm bg-white/80 border-2 rounded-3xl shadow-lg hover:shadow-2xl transition-all duration-500 overflow-hidden ${
                activeIndex === index
                  ? "border-violet-400 shadow-violet-200/50"
                  : "border-gray-200/50 hover:border-violet-300"
              }`}
            >
              {/* Gradient Accent Bar */}
              <div
                className={`absolute left-0 top-0 bottom-0 w-1.5 bg-gradient-to-b from-violet-500 via-purple-500 to-fuchsia-500 transition-all duration-500 ${
                  activeIndex === index ? "opacity-100" : "opacity-0"
                }`}
              />

              {/* Question Button */}
              <button
                onClick={() => toggleFAQ(index)}
                className="w-full flex justify-between items-center p-6 text-left group-hover:bg-violet-50/50 transition-colors duration-300"
              >
                <div className="flex items-start gap-4 flex-1">
                  <div
                    className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold transition-all duration-300 ${
                      activeIndex === index
                        ? "bg-gradient-to-br from-violet-500 to-purple-600 text-white scale-110"
                        : "bg-violet-100 text-violet-600 group-hover:scale-105"
                    }`}
                  >
                    {index + 1}
                  </div>
                  <span
                    className={`font-semibold text-lg transition-colors duration-300 ${
                      activeIndex === index
                        ? "text-violet-700"
                        : "text-gray-800 group-hover:text-violet-600"
                    }`}
                  >
                    {item.question}
                  </span>
                </div>

                <div
                  className={`flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center transition-all duration-300 ${
                    activeIndex === index
                      ? "bg-violet-100 rotate-180"
                      : "bg-gray-100 group-hover:bg-violet-50"
                  }`}
                >
                  <ChevronDown
                    className={`transition-colors duration-300 ${
                      activeIndex === index
                        ? "text-violet-600"
                        : "text-gray-500"
                    }`}
                  />
                </div>
              </button>

              {/* Answer */}
              <div
                className={`transition-all duration-500 ease-in-out ${
                  activeIndex === index
                    ? "max-h-48 opacity-100"
                    : "max-h-0 opacity-0"
                }`}
              >
                <div className="px-6 pb-6 pl-[4.5rem]">
                  <div className="bg-gradient-to-br from-violet-50/80 to-purple-50/80 rounded-2xl p-5 border border-violet-100">
                    <p className="text-gray-700 leading-relaxed">
                      {item.answer}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Footer CTA */}
        <div className="mt-16 text-center">
          <div className="inline-block bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg p-8 border border-gray-200/50">
            <p className="text-gray-700 mb-4 text-lg">
              Still have questions?
            </p>
            <button className="px-8 py-3 bg-gradient-to-r from-violet-600 via-purple-600 to-fuchsia-600 text-white font-semibold rounded-full shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-300">
              Contact Support
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default FAQ;