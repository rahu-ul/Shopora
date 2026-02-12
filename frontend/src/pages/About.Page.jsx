import React from "react";
import {
  Shield,
  Database,
  Zap,
  Package,
  Lock,
  Server,
  LayoutDashboard,
  ShoppingCart,
  Globe,
  Code,
  Layers,
  ArrowRight,
  CheckCircle,
  Users,
  TrendingUp,
  Award,
  Sparkles,
  Github,
  Eye,
  Rocket,
  Star,
  Terminal,
  GitBranch,
  Activity
} from "lucide-react";

const AboutPage = () => {
  const techStack = [
    {
      name: "React (Vite)",
      icon: Code,
      color: "from-blue-500 to-cyan-500",
      description: "Lightning-fast development",
      badge: "Frontend"
    },
    {
      name: "Node.js + Express",
      icon: Server,
      color: "from-green-500 to-emerald-500",
      description: "Robust backend server",
      badge: "Backend"
    },
    {
      name: "MongoDB",
      icon: Database,
      color: "from-green-600 to-teal-500",
      description: "Scalable NoSQL database",
      badge: "Database"
    },
    {
      name: "JWT Authentication",
      icon: Lock,
      color: "from-orange-500 to-red-500",
      description: "Secure user sessions",
      badge: "Security"
    },
    {
      name: "Socket.IO",
      icon: Zap,
      color: "from-yellow-500 to-orange-500",
      description: "Real-time communication",
      badge: "Real-time"
    },
    {
      name: "REST API",
      icon: Layers,
      color: "from-purple-500 to-pink-500",
      description: "Structured endpoints",
      badge: "API"
    },
  ];

  const features = [
    {
      icon: Shield,
      title: "JWT-Based Authentication",
      description:
        "Secure login and protected routes using JSON Web Tokens with role-based access control.",
      color: "violet",
      gradient: "from-violet-500 to-purple-600"
    },
    {
      icon: ShoppingCart,
      title: "Dynamic Cart Management",
      description:
        "Add, remove, and update cart items with real-time state synchronization.",
      color: "blue",
      gradient: "from-blue-500 to-cyan-600"
    },
    {
      icon: Package,
      title: "Inventory & Order System",
      description:
        "Stock management with automatic updates after order placement and return approval.",
      color: "green",
      gradient: "from-green-500 to-emerald-600"
    },
    {
      icon: LayoutDashboard,
      title: "Admin Dashboard",
      description:
        "Full product CRUD operations, order management, and user monitoring.",
      color: "purple",
      gradient: "from-purple-500 to-pink-600"
    },
    {
      icon: Zap,
      title: "Real-Time Updates",
      description:
        "Live order status updates using Socket.IO for seamless user experience.",
      color: "yellow",
      gradient: "from-yellow-500 to-orange-600"
    },
    {
      icon: Globe,
      title: "Scalable Architecture",
      description:
        "Modular backend structure with controllers, middleware, and route separation.",
      color: "cyan",
      gradient: "from-cyan-500 to-blue-600"
    },
  ];

  const stats = [
    { label: "Protected Routes", value: "Role-Based Access", icon: Shield },
    { label: "Order Lifecycle", value: "End-to-End Managed", icon: ShoppingCart },
    { label: "API Structure", value: "Modular REST", icon: Layers },
    { label: "Security Layer", value: "Hash + Token", icon: Lock },
  ];

  const highlights = [
    { text: "Production-ready code architecture", icon: Rocket },
    { text: "Comprehensive error handling", icon: Shield },
    { text: "RESTful API conventions", icon: Activity },
    { text: "Password hashing & encryption", icon: Lock },
    { text: "Token-based authorization", icon: CheckCircle },
    { text: "Real-time notifications", icon: Zap },
    { text: "Mobile-responsive design", icon: Globe },
    { text: "Optimized performance", icon: TrendingUp },
  ];

  const architecturePoints = [
    {
      icon: Server,
      title: "Modular Backend",
      description: "Clearly separated routes, controllers, middleware, and models"
    },
    {
      icon: Lock,
      title: "JWT Security",
      description: "Token-based authentication and authorization system"
    },
    {
      icon: Zap,
      title: "Real-Time Engine",
      description: "Socket.IO enables live order status updates"
    },
    {
      icon: Database,
      title: "Data Persistence",
      description: "MongoDB for scalable and flexible data storage"
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-violet-50 via-purple-50 to-fuchsia-50">

      {/* HERO SECTION */}
      <div className="relative overflow-hidden bg-gradient-to-br from-violet-600 via-purple-600 to-fuchsia-600">
        {/* Animated Background Elements */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-0 left-1/4 w-96 h-96 bg-white/10 rounded-full blur-3xl animate-pulse-slow" />
          <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-white/10 rounded-full blur-3xl animate-pulse-slow animation-delay-1000" />
          
          {/* Floating Particles */}
          {[...Array(15)].map((_, i) => (
            <div
              key={i}
              className="absolute w-2 h-2 bg-white/30 rounded-full animate-float-particles"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                animationDelay: `${Math.random() * 5}s`,
                animationDuration: `${10 + Math.random() * 20}s`,
              }}
            />
          ))}
        </div>

        <div className="relative max-w-7xl mx-auto px-6 py-32">
          <div className="text-center">
            <div className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-md px-5 py-2.5 rounded-full mb-8 border border-white/30 hover:bg-white/30 transition-all duration-300 animate-fade-in-up">
              <Sparkles className="w-4 h-4 text-white" />
              <span className="text-white text-sm font-semibold">Full-Stack MERN Project</span>
            </div>

            <h1 className="text-6xl md:text-8xl font-black text-white mb-8 leading-tight tracking-tight animate-fade-in-up animation-delay-200">
              Shopora
            </h1>
            <p className="text-3xl md:text-4xl text-white/95 mb-6 font-bold animate-fade-in-up animation-delay-400">
              A Scalable Full-Stack E-Commerce Platform
            </p>
            <p className="text-xl text-white/85 max-w-4xl mx-auto mb-12 leading-relaxed animate-fade-in-up animation-delay-600">
              Production-style eCommerce application built with the MERN stack.
              Featuring secure authentication, real-time updates, and enterprise-grade
              architecture to simulate real-world online shopping systems.
            </p>

            <div className="flex flex-wrap items-center justify-center gap-6 animate-fade-in-up animation-delay-800">
              <a
                href="/product"
                className="group inline-flex items-center gap-3 bg-white text-violet-600 px-10 py-5 rounded-full font-bold text-lg shadow-2xl hover:shadow-white/25 hover:scale-110 transition-all duration-300"
              >
                Explore Products
                <ArrowRight className="w-5 h-5 group-hover:translate-x-2 transition-transform" />
              </a>
              <a
                href="https://github.com/yourusername/shopora"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-3 bg-white/10 backdrop-blur-md text-white border-2 border-white/40 px-10 py-5 rounded-full font-bold text-lg hover:bg-white/20 hover:border-white/60 transition-all duration-300"
              >
                <Github className="w-5 h-5" />
                View Source
              </a>
            </div>
          </div>
        </div>

        {/* Wave Divider */}
        <div className="absolute bottom-0 left-0 right-0">
          <svg className="w-full h-24" viewBox="0 0 1440 120" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path
              d="M0 120L60 105C120 90 240 60 360 45C480 30 600 30 720 37.5C840 45 960 60 1080 67.5C1200 75 1320 75 1380 75L1440 75V120H1380C1320 120 1200 120 1080 120C960 120 840 120 720 120C600 120 480 120 360 120C240 120 120 120 60 120H0Z"
              className="fill-violet-50"
            />
          </svg>
        </div>
      </div>

      {/* STATS SECTION */}
      <div className="relative -mt-20 max-w-7xl mx-auto px-6 z-20">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {stats.map((stat, index) => {
            const IconComponent = stat.icon;
            return (
              <div
                key={index}
                className="group bg-white/95 backdrop-blur-md rounded-3xl p-8 text-center shadow-2xl border-2 border-gray-100 hover:border-violet-300 hover:shadow-violet-200/50 hover:scale-105 transition-all duration-300 animate-slide-up"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-violet-500 to-purple-600 rounded-2xl mb-5 group-hover:scale-110 group-hover:rotate-6 transition-all duration-300 shadow-lg">
                  <IconComponent className="w-8 h-8 text-white" />
                </div>
                <div className="text-lg font-bold text-violet-600 mb-2">
                  {stat.value}
                </div>
                <div className="text-sm text-gray-600 font-semibold">
                  {stat.label}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* PROJECT OVERVIEW */}
      <div className="max-w-7xl mx-auto px-6 py-32">
        <div className="text-center mb-20">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-violet-500 to-purple-600 rounded-3xl mb-8 shadow-xl animate-bounce-slow">
            <Award className="w-10 h-10 text-white" />
          </div>
          <h2 className="text-5xl md:text-6xl font-black bg-gradient-to-r from-violet-600 via-purple-600 to-fuchsia-600 bg-clip-text text-transparent mb-8 leading-tight">
            Project Overview
          </h2>
          <p className="text-xl text-gray-700 max-w-4xl mx-auto leading-relaxed">
            The goal of Shopora is to design and implement a modern eCommerce
            system with production-level practices. It includes authentication,
            real-time communication, inventory handling, order lifecycle
            management, and secure REST API integration.
          </p>
        </div>

        {/* Highlights Grid */}
        <div className="grid md:grid-cols-2 gap-5 max-w-5xl mx-auto">
          {highlights.map((highlight, index) => {
            const IconComponent = highlight.icon;
            return (
              <div
                key={index}
                className="group flex items-center gap-4 bg-white/90 backdrop-blur-sm rounded-2xl p-6 shadow-lg border-2 border-gray-100 hover:border-violet-300 hover:shadow-xl hover:scale-105 transition-all duration-300"
              >
                <div className="flex-shrink-0 w-12 h-12 bg-gradient-to-br from-green-100 to-emerald-100 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform">
                  <IconComponent className="w-6 h-6 text-green-600" />
                </div>
                <span className="text-gray-800 font-semibold text-lg">{highlight.text}</span>
              </div>
            );
          })}
        </div>
      </div>

      {/* TECH STACK */}
      <div className="relative bg-white/60 backdrop-blur-sm py-32 overflow-hidden">
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-5">
          <div className="absolute inset-0" style={{
            backgroundImage: 'radial-gradient(circle at 1px 1px, rgb(139, 92, 246) 1px, transparent 0)',
            backgroundSize: '40px 40px'
          }} />
        </div>

        <div className="relative max-w-7xl mx-auto px-6">
          <div className="text-center mb-20">
            <div className="inline-flex items-center gap-3 mb-6">
              <div className="w-16 h-1 bg-gradient-to-r from-transparent via-violet-600 to-transparent rounded-full" />
              <Terminal className="w-8 h-8 text-violet-600" />
              <div className="w-16 h-1 bg-gradient-to-r from-transparent via-violet-600 to-transparent rounded-full" />
            </div>
            <h2 className="text-5xl md:text-6xl font-black bg-gradient-to-r from-violet-600 via-purple-600 to-fuchsia-600 bg-clip-text text-transparent mb-6">
              Technology Stack
            </h2>
            <p className="text-gray-600 text-xl font-medium">
              Built with modern, industry-standard technologies
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {techStack.map((tech, index) => {
              const IconComponent = tech.icon;
              return (
                <div
                  key={index}
                  className="group relative bg-white rounded-3xl p-8 shadow-xl hover:shadow-2xl transition-all duration-500 border-2 border-gray-100 hover:border-violet-300 overflow-hidden hover:-translate-y-2"
                >
                  {/* Gradient Background on Hover */}
                  <div className={`absolute inset-0 bg-gradient-to-br ${tech.color} opacity-0 group-hover:opacity-10 transition-opacity duration-500`} />

                  <div className="relative">
                    {/* Badge */}
                    <div className="absolute top-0 right-0 bg-violet-100 text-violet-700 px-3 py-1 rounded-full text-xs font-bold">
                      {tech.badge}
                    </div>

                    <div className={`inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br ${tech.color} rounded-3xl mb-6 shadow-xl group-hover:scale-110 group-hover:rotate-6 transition-all duration-300`}>
                      <IconComponent className="w-10 h-10 text-white" />
                    </div>
                    <h3 className="text-2xl font-bold text-gray-800 mb-3 group-hover:text-violet-700 transition-colors">
                      {tech.name}
                    </h3>
                    <p className="text-gray-600 leading-relaxed">{tech.description}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* KEY FEATURES */}
      <div className="max-w-7xl mx-auto px-6 py-32">
        <div className="text-center mb-20">
          <div className="inline-flex items-center gap-3 mb-6">
            <Star className="w-8 h-8 text-violet-600 fill-violet-600" />
            <Star className="w-6 h-6 text-purple-600 fill-purple-600" />
            <Star className="w-4 h-4 text-fuchsia-600 fill-fuchsia-600" />
          </div>
          <h2 className="text-5xl md:text-6xl font-black bg-gradient-to-r from-violet-600 via-purple-600 to-fuchsia-600 bg-clip-text text-transparent mb-6">
            Key Features
          </h2>
          <p className="text-gray-600 text-xl font-medium">
            Comprehensive functionality for a complete shopping experience
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => {
            const IconComponent = feature.icon;
            return (
              <div
                key={index}
                className="group bg-white/90 backdrop-blur-sm rounded-3xl p-8 shadow-xl hover:shadow-2xl transition-all duration-500 border-2 border-gray-100 hover:border-violet-300 overflow-hidden hover:-translate-y-2"
              >
                {/* Gradient overlay */}
                <div className={`absolute inset-0 bg-gradient-to-br ${feature.gradient} opacity-0 group-hover:opacity-5 transition-opacity duration-500`} />
                
                <div className="relative">
                  <div className={`inline-flex items-center justify-center w-18 h-18 bg-gradient-to-br ${feature.gradient} rounded-2xl mb-6 group-hover:scale-110 group-hover:rotate-6 transition-all duration-300 shadow-lg`}>
                    <IconComponent className="w-9 h-9 text-white" />
                  </div>
                  <h3 className="text-2xl font-bold text-gray-800 mb-4 group-hover:text-violet-700 transition-colors">
                    {feature.title}
                  </h3>
                  <p className="text-gray-600 leading-relaxed">
                    {feature.description}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* SYSTEM ARCHITECTURE */}
      <div className="relative bg-gradient-to-br from-violet-600 via-purple-600 to-fuchsia-600 py-32 overflow-hidden">
        {/* Animated Background */}
        <div className="absolute inset-0">
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-white/10 rounded-full blur-3xl animate-pulse-slow" />
          <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-white/10 rounded-full blur-3xl animate-pulse-slow animation-delay-1000" />
        </div>

        <div className="relative max-w-7xl mx-auto px-6">
          <div className="bg-white/10 backdrop-blur-xl rounded-3xl p-12 border-2 border-white/20 shadow-2xl">
            <div className="flex items-center gap-5 mb-10">
              <div className="w-16 h-16 bg-white/20 backdrop-blur-md rounded-2xl flex items-center justify-center">
                <Server className="w-8 h-8 text-white" />
              </div>
              <h2 className="text-5xl font-black text-white">
                System Architecture
              </h2>
            </div>

            <div className="space-y-8 text-white/90 text-lg leading-relaxed mb-12">
              <p className="text-xl">
                Shopora follows a <span className="font-bold text-white bg-white/10 px-2 py-1 rounded">modular backend architecture</span> with clearly
                separated routes, controllers, middleware, and models. JWT is used
                for authentication and authorization. Socket.IO enables real-time
                order updates. MongoDB manages persistent data storage, while
                Express handles REST API routing and request processing.
              </p>
              <p className="text-xl">
                The frontend is built using <span className="font-bold text-white bg-white/10 px-2 py-1 rounded">React (Vite)</span> with reusable components
                and state management. Protected routes ensure only authenticated
                users can access private resources such as orders and dashboard
                sections.
              </p>
            </div>

            {/* Architecture Points Grid */}
            <div className="grid md:grid-cols-2 gap-6">
              {architecturePoints.map((point, index) => {
                const IconComponent = point.icon;
                return (
                  <div
                    key={index}
                    className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20 hover:bg-white/20 transition-all duration-300 hover:scale-105"
                  >
                    <div className="flex items-start gap-4">
                      <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center flex-shrink-0">
                        <IconComponent className="w-6 h-6 text-white" />
                      </div>
                      <div>
                        <h4 className="text-lg font-bold text-white mb-2">{point.title}</h4>
                        <p className="text-white/80 text-sm leading-relaxed">{point.description}</p>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      {/* DEVELOPMENT APPROACH */}
      <div className="max-w-7xl mx-auto px-6 py-32">
        <div className="bg-gradient-to-br from-white via-violet-50 to-purple-50 backdrop-blur-sm rounded-3xl p-12 md:p-16 shadow-2xl border-2 border-gray-200/50 overflow-hidden relative">
          {/* Background Pattern */}
          <div className="absolute inset-0 opacity-5">
            <div className="absolute inset-0" style={{
              backgroundImage: 'radial-gradient(circle at 2px 2px, rgb(139, 92, 246) 1px, transparent 0)',
              backgroundSize: '32px 32px'
            }} />
          </div>

          <div className="relative">
            <div className="flex items-center gap-5 mb-10">
              <div className="w-16 h-16 bg-gradient-to-br from-violet-500 to-purple-600 rounded-2xl flex items-center justify-center shadow-xl">
                <Code className="w-8 h-8 text-white" />
              </div>
              <h2 className="text-5xl font-black bg-gradient-to-r from-violet-600 to-purple-600 bg-clip-text text-transparent">
                Development Approach
              </h2>
            </div>

            <p className="text-2xl text-gray-700 leading-relaxed mb-8">
              The application is built following <span className="font-bold text-violet-700 bg-violet-100 px-2 py-1 rounded">best practices</span> including proper
              error handling, edge case management, RESTful conventions, and clean
              folder structure.
            </p>

            <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-8 border-2 border-violet-200 shadow-lg">
              <p className="text-lg text-gray-700 leading-relaxed">
                Security considerations such as <span className="font-semibold text-violet-700">password hashing</span>,
                <span className="font-semibold text-violet-700"> token validation</span>, and <span className="font-semibold text-violet-700">protected endpoints</span> were implemented to
                replicate real-world standards and industry best practices.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* CTA SECTION */}
      <div className="relative bg-gradient-to-br from-violet-600 via-purple-600 to-fuchsia-600 py-32 overflow-hidden">
        {/* Animated Elements */}
        <div className="absolute inset-0">
          <div className="absolute top-0 left-0 w-full h-full">
            {[...Array(20)].map((_, i) => (
              <div
                key={i}
                className="absolute w-2 h-2 bg-white/30 rounded-full animate-float-particles"
                style={{
                  left: `${Math.random() * 100}%`,
                  top: `${Math.random() * 100}%`,
                  animationDelay: `${Math.random() * 5}s`,
                  animationDuration: `${10 + Math.random() * 20}s`,
                }}
              />
            ))}
          </div>
        </div>

        <div className="relative max-w-4xl mx-auto px-6 text-center">
          <div className="inline-flex items-center justify-center w-24 h-24 bg-white/20 backdrop-blur-md rounded-3xl mb-10 shadow-2xl border-2 border-white/30 animate-bounce-slow">
            <Eye className="w-12 h-12 text-white" />
          </div>
          <h2 className="text-5xl md:text-6xl font-black text-white mb-8 leading-tight">
            Explore Shopora in Action
          </h2>
          <p className="text-2xl text-white/90 mb-12 max-w-2xl mx-auto leading-relaxed">
            Experience the power of modern e-commerce technology with real-world features
          </p>

          <div className="flex flex-wrap items-center justify-center gap-6">
            <a
              href="/product"
              className="group inline-flex items-center gap-3 bg-white text-violet-600 px-12 py-6 rounded-full font-bold text-xl shadow-2xl hover:shadow-white/30 hover:scale-110 transition-all duration-300"
            >
              View Products
              <ShoppingCart className="w-6 h-6 group-hover:scale-125 transition-transform" />
            </a>

            <a
              href="https://github.com/yourusername/shopora"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-3 bg-white/10 backdrop-blur-md text-white border-2 border-white/40 px-12 py-6 rounded-full font-bold text-xl hover:bg-white/20 hover:border-white/60 transition-all duration-300"
            >
              <Github className="w-6 h-6" />
              View Source Code
            </a>
          </div>

          {/* Additional Info */}
          <div className="mt-16 pt-12 border-t-2 border-white/20">
            <div className="flex flex-wrap items-center justify-center gap-8 text-white/80">
              <div className="flex items-center gap-2">
                <GitBranch className="w-5 h-5" />
                <span className="font-semibold">Open Source</span>
              </div>
              <div className="flex items-center gap-2">
                <Star className="w-5 h-5 fill-white/80" />
                <span className="font-semibold">Production Ready</span>
              </div>
              <div className="flex items-center gap-2">
                <Rocket className="w-5 h-5" />
                <span className="font-semibold">Scalable</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Custom Animations */}
      <style>{`
        @keyframes fade-in-up {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes slide-up {
          from {
            opacity: 0;
            transform: translateY(40px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes float-particles {
          0%, 100% {
            transform: translate(0, 0);
            opacity: 0;
          }
          10%, 90% {
            opacity: 1;
          }
          50% {
            transform: translate(100px, -100px);
            opacity: 0.6;
          }
        }

        @keyframes pulse-slow {
          0%, 100% {
            opacity: 0.3;
            transform: scale(1);
          }
          50% {
            opacity: 0.5;
            transform: scale(1.1);
          }
        }

        @keyframes bounce-slow {
          0%, 100% {
            transform: translateY(0);
          }
          50% {
            transform: translateY(-15px);
          }
        }

        .animate-fade-in-up {
          animation: fade-in-up 0.8s ease-out both;
        }

        .animate-slide-up {
          animation: slide-up 0.8s ease-out both;
        }

        .animate-float-particles {
          animation: float-particles 15s ease-in-out infinite;
        }

        .animate-pulse-slow {
          animation: pulse-slow 4s ease-in-out infinite;
        }

        .animate-bounce-slow {
          animation: bounce-slow 3s ease-in-out infinite;
        }

        .animation-delay-200 {
          animation-delay: 200ms;
        }

        .animation-delay-400 {
          animation-delay: 400ms;
        }

        .animation-delay-600 {
          animation-delay: 600ms;
        }

        .animation-delay-800 {
          animation-delay: 800ms;
        }

        .animation-delay-1000 {
          animation-delay: 1000ms;
        }
      `}</style>

    </div>
  );
};

export default AboutPage;
