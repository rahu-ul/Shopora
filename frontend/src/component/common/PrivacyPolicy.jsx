import React from "react";
import { Shield, Lock, Cookie, Users, UserCheck, Mail, Calendar } from "lucide-react";

const PrivacyPolicy = () => {
  const sections = [
    {
      icon: Users,
      title: "Information We Collect",
      content: [
        "Name, email address, and phone number",
        "Shipping and billing address",
        "Payment details (processed securely)",
        "Order history",
        "Device and browser information",
      ],
    },
    {
      icon: Shield,
      title: "How We Use Your Information",
      content: [
        "To process and deliver orders",
        "To provide real-time order updates",
        "To improve website performance",
        "To provide customer support",
        "To prevent fraud and ensure security",
      ],
    },
    {
      icon: Lock,
      title: "Payment Security",
      description:
        "We use secure encryption and authentication methods to protect your payment information. Shopora does not store full card details on our servers.",
    },
    {
      icon: Cookie,
      title: "Cookies Policy",
      description:
        "We use cookies to enhance user experience, remember login sessions, and analyze website traffic.",
    },
    {
      icon: Users,
      title: "Data Sharing",
      description:
        "We do not sell your personal data. Information may be shared only with trusted delivery and payment partners to fulfill your orders.",
    },
    {
      icon: UserCheck,
      title: "Your Rights",
      content: [
        "Update your personal information",
        "Request account deletion",
        "Request data removal",
      ],
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-violet-50 via-purple-50 to-fuchsia-50">
      <div className="max-w-6xl mx-auto px-6 py-20">
        {/* Hero Section */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-violet-500 to-purple-600 rounded-3xl mb-6 shadow-2xl shadow-violet-500/30 animate-pulse">
            <Shield className="w-10 h-10 text-white" />
          </div>
          <h1 className="text-6xl font-bold bg-gradient-to-r from-violet-600 via-purple-600 to-fuchsia-600 bg-clip-text text-transparent mb-6">
            Privacy Policy
          </h1>
          <p className="text-gray-600 text-lg max-w-3xl mx-auto leading-relaxed">
            At Shopora, we value your privacy. This Privacy Policy explains how
            we collect, use, and protect your personal information when you use
            our website.
          </p>
        </div>

        {/* Sections Grid */}
        <div className="grid gap-8 mb-16">
          {sections.map((section, index) => {
            const IconComponent = section.icon;
            return (
              <div
                key={index}
                className="group relative bg-white/80 backdrop-blur-sm rounded-3xl p-8 shadow-lg hover:shadow-2xl transition-all duration-500 border-2 border-gray-200/50 hover:border-violet-300 overflow-hidden"
              >
                {/* Animated Background Gradient */}
                <div className="absolute inset-0 bg-gradient-to-br from-violet-500/5 via-purple-500/5 to-fuchsia-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

                {/* Content */}
                <div className="relative">
                  <div className="flex items-start gap-6">
                    {/* Icon */}
                    <div className="flex-shrink-0 w-14 h-14 bg-gradient-to-br from-violet-500 to-purple-600 rounded-2xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300">
                      <IconComponent className="w-7 h-7 text-white" />
                    </div>

                    {/* Text Content */}
                    <div className="flex-1">
                      <h2 className="text-2xl font-bold text-gray-800 mb-4 group-hover:text-violet-700 transition-colors duration-300">
                        {index + 1}. {section.title}
                      </h2>

                      {section.description && (
                        <p className="text-gray-600 leading-relaxed">
                          {section.description}
                        </p>
                      )}

                      {section.content && (
                        <ul className="space-y-3">
                          {section.content.map((item, i) => (
                            <li
                              key={i}
                              className="flex items-start gap-3 text-gray-600"
                            >
                              <div className="flex-shrink-0 w-6 h-6 bg-violet-100 rounded-full flex items-center justify-center mt-0.5">
                                <div className="w-2 h-2 bg-violet-500 rounded-full" />
                              </div>
                              <span className="leading-relaxed">{item}</span>
                            </li>
                          ))}
                        </ul>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Contact Section */}
        <div className="relative bg-gradient-to-br from-violet-600 via-purple-600 to-fuchsia-600 rounded-3xl p-10 shadow-2xl shadow-violet-500/30 overflow-hidden">
          {/* Decorative Elements */}
          <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl" />
          <div className="absolute bottom-0 left-0 w-48 h-48 bg-white/10 rounded-full blur-3xl" />

          <div className="relative">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center">
                <Mail className="w-6 h-6 text-white" />
              </div>
              <h2 className="text-3xl font-bold text-white">Contact Us</h2>
            </div>

   <p className="text-white/90 text-lg mb-6 leading-relaxed">
  If you have any questions about this Privacy Policy, please
  contact us at{" "}
  <a
    href="mailto:support@shopora.com"
    className="font-semibold underline decoration-2 underline-offset-4 hover:text-white transition-colors"
  >
    rahul12@gmail.com
  </a>
</p>

           
          </div>
        </div>

        {/* Trust Badges */}
        <div className="mt-12 grid grid-cols-2 md:grid-cols-4 gap-6">
          {[
            { icon: Shield, text: "SSL Secured" },
            { icon: Lock, text: "Data Protected" },
            { icon: UserCheck, text: "GDPR Compliant" },
            { icon: Cookie, text: "Cookie Control" },
          ].map((badge, index) => {
            const BadgeIcon = badge.icon;
            return (
              <div
                key={index}
                className="bg-white/60 backdrop-blur-sm rounded-2xl p-6 text-center border border-gray-200/50 hover:border-violet-300 hover:shadow-lg transition-all duration-300"
              >
                <div className="inline-flex items-center justify-center w-12 h-12 bg-violet-100 rounded-xl mb-3">
                  <BadgeIcon className="w-6 h-6 text-violet-600" />
                </div>
                <p className="text-sm font-semibold text-gray-700">
                  {badge.text}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default PrivacyPolicy;