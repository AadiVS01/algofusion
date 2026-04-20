# Voice-Driven Clinical System (Hackathon Problem Statement)

## 🏥 Problem Statement

Modern public hospitals in India face significant challenges in managing patient-doctor interactions due to multilingual communication, unstructured data capture, and inefficient record-keeping systems.

Patients often describe symptoms in regional languages such as Marathi or Hindi, while doctors may respond in another language, and records are typically maintained in English. This leads to fragmented communication, misinterpretation, and loss of critical medical information.

Additionally, handwritten prescriptions, unstructured patient histories, and lack of centralized data storage contribute to inefficiencies, errors, and delays in treatment.

The problem is to design and build a **voice-driven AI system** that can:
- Capture real-time conversations between patients and doctors
- Understand multilingual input
- Convert unstructured spoken dialogue into structured medical data
- Store and retrieve patient records efficiently

---

## 📖 Problem Description

The goal is to develop a **Voice-Driven Clinical Assistant** capable of transforming chaotic hospital interactions into structured, actionable data in real-time.

### 🎯 Core Objective

Build a Minimum Viable Product (MVP) that focuses on a single workflow (e.g., doctor-patient consultation) and ensures reliable end-to-end execution from audio capture to structured data storage.

---

## 🔑 Key Functional Requirements

### 1. Real-Time Voice Capture
- The system must record live audio from a web or mobile interface.
- It should work effectively in real-world hospital environments.

### 2. Multilingual Processing
- Must support English and at least one regional language (Hindi or Marathi).
- Should automatically detect and process the language being spoken.

### 3. Structured Data Extraction
- Convert conversational audio into structured JSON format.
- Extract key medical details such as:
  - Symptoms  
  - Duration  
  - Diagnosis  
  - Medications  

### 4. Patient Data Management
- Store extracted information in a database.
- Associate all records with a unique Patient ID.

---

## 🌟 Extended Features (Optional Enhancements)

To improve system capability and scoring, the following features can be implemented:

- **Voice-Enabled RAG Chatbot**  
  Enables doctors to query patient history using natural language.

- **Longitudinal Session Tracking**  
  Tracks patient data across multiple visits over time.

- **Code-Switching Handling**  
  Processes mixed-language sentences within a single conversation.

- **Doctor Assist Mode**  
  Suggests possible diagnoses and flags missing clinical information.

---

## ⚠️ Real-World Challenges to Address

A robust solution should handle:

- Background noise in hospital environments
- Ambiguous patient responses
- Similar-sounding drug names
- Variations in accents and speech patterns

---

## ⏱️ Development Constraints

- Total time: **9 hours**
- Focus on building a reliable MVP first before adding enhancements.

---

## 📊 Evaluation Criteria

The solution will be judged based on:

1. **Core AI Engine (35 points)**  
   Accuracy of speech recognition, language detection, and data extraction.

2. **MVP Execution (25 points)**  
   End-to-end functionality from input to storage.

3. **Real-World Resilience (15 points)**  
   Ability to handle noise, ambiguity, and edge cases.

4. **Architecture & Enhancements (15 points)**  
   Additional features and system design.

5. **User Experience & Presentation (10 points)**  
   Ease of use and clarity of the solution.

---

## 🚀 Conclusion

This problem challenges developers to build an intelligent system that bridges communication gaps in healthcare using AI. The solution should prioritize accuracy, usability, and real-world applicability, ultimately improving efficiency and patient care in clinical environments.
