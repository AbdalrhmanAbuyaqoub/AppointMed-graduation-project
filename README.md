# AppointMed - AI-Powered Healthcare Scheduling System 🏥🤖

## 📋 Overview

**AppointMed** is a sophisticated AI-powered appointment management system that revolutionizes healthcare scheduling through intelligent automation. Built as a graduation project, this system combines cutting-edge AI technology with comprehensive administrative tools to streamline the appointment booking process for both patients and healthcare providers.

**This repository contains the frontend React application** that provides the user interface for both patients and administrative staff.

### 🌟 Key Innovation

The system is architected around **DeepSeek's Large Language Model (LLM)** that functions as a central reasoning engine, providing patients with 24/7 conversational appointment booking while giving administrative staff complete control through a comprehensive management interface.

## 🚀 Features

### 🤖 AI-Powered Patient Experience

- **Conversational AI Booking**: Natural language appointment scheduling through chat interface
- **Multi-Platform Access**: Available via web chat interface and Telegram bot integration
- **24/7 Availability**: Round-the-clock intelligent scheduling assistant
- **Advanced NLU**: Sophisticated Natural Language Understanding for complex requests

### 👨‍💼 Administrative Excellence

- **Complete Dashboard**: Comprehensive overview of appointments, doctors, and clinics
- **Manual Appointment Management**: Full control over scheduling and modifications
- **Doctor Management**: Add, edit, and manage healthcare providers
- **Clinic Administration**: Multi-clinic support with detailed management tools
- **Patient Records**: Comprehensive patient information and history tracking
- **Working Hours Management**: Flexible scheduling for healthcare providers
- **Real-time Synchronization**: Seamless integration between AI and manual bookings

### 🔧 Technical Features

- **Role-Based Access Control**: Separate interfaces for patients and administrators
- **Responsive Design**: Optimized for desktop, tablet, and mobile devices
- **Real-time Updates**: Live synchronization across all interfaces
- **Error Handling**: Comprehensive error boundaries and user feedback
- **Modern UI/UX**: Beautiful, intuitive interface built with Mantine

## 🛠️ Technology Stack

### Frontend (This Repository)

- **React 19** - Modern functional components with hooks
- **Vite** - Fast build tool and development server
- **Mantine UI** - Modern React components library
- **React Router** - Client-side routing
- **React Query (TanStack)** - Server state management
- **Zustand** - Client state management
- **Axios** - HTTP client for API communication
- **Day.js** - Date manipulation and formatting

## 📁 Frontend Structure (This Repository)

```
src/
├── components/          # Reusable UI components
├── pages/              # Route-based page components
├── hooks/              # Custom React hooks for data fetching
├── services/           # API service layer
├── store/              # State management (Zustand)
├── layouts/            # Page layout components
├── routes/             # Routing configuration
├── providers/          # Context providers
├── utils/              # Utility functions
├── assets/             # Static assets and images
└── styles/             # CSS modules and styling
```

## 🔗 Related Repositories

### Backend

**Repository**: [appointMed-backend](https://github.com/Yousef-Sabra/ClinicAppointmentBookingnew.git)  
_Core backend API handling appointment management, user authentication, clinic operations, and data persistence._

### AI Agent (Chatbot & AI Services)

**Repository**: [appointMed-ai-agent](https://github.com/Majhool/AppointmentBookingMaster.git)  
_Comprehensive AI service powered by DeepSeek's Large Language Model handling all chatbot functionality, conversational appointment booking, and intelligent patient interaction across multiple platforms including web chat and Telegram._

### API Integration

The application integrates with two main services:

1. **Main Backend API** - Handles user management, appointments, clinics, and doctors
2. **AI Chatbot API** - Powers the conversational AI booking system
