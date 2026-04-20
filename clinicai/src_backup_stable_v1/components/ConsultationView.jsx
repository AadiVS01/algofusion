import React, { useState } from 'react';

export default function ConsultationView({ transcript, isRecording, startRecording, stopRecording }) {
  return (
    <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 mb-6">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-semibold text-gray-800">Consultation Recording</h2>
        <button
          onClick={isRecording ? stopRecording : startRecording}
          className={`px-6 py-2 rounded-full font-medium transition-all ${
            isRecording 
              ? 'bg-red-500 text-white animate-pulse' 
              : 'bg-indigo-600 text-white hover:bg-indigo-700'
          }`}
        >
          {isRecording ? 'Stop Recording' : 'Start Consultation'}
        </button>
      </div>
      
      <div className="bg-gray-50 rounded-lg p-4 h-64 overflow-y-auto border border-gray-200">
        <div className="flex items-center space-x-2 mb-2">
          <div className={`w-2 h-2 rounded-full ${isRecording ? 'bg-red-500' : 'bg-gray-300'}`}></div>
          <span className="text-xs font-semibold uppercase tracking-wider text-gray-500">
            {isRecording ? 'Live Transcript' : 'Recording Standby'}
          </span>
        </div>
        <p className="text-gray-700 leading-relaxed whitespace-pre-wrap">
          {transcript || "Wait for consultation to start..."}
        </p>
      </div>
    </div>
  );
}
