import React, { useState, useRef } from 'react';
import { Camera, X, Loader2, Type } from 'lucide-react';

interface QRScannerProps {
  onResult: (data: string) => void;
  onClose: () => void;
  loading: boolean;
}

export default function QRScanner({ onResult, onClose, loading }: QRScannerProps) {
  const [manualInput, setManualInput] = useState('');
  const [useManualInput, setUseManualInput] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);

  const handleManualSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (manualInput.trim()) {
      onResult(manualInput.trim());
      setManualInput('');
    }
  };

  const simulateQRCode = () => {
    // Simulate scanning a QR code for demo purposes
    const mockQRData = `ATTENDANCE_${Date.now()}_CLASS_${Math.floor(Math.random() * 100)}`;
    onResult(mockQRData);
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h4 className="text-lg font-medium text-gray-900">QR Code Scanner</h4>
        <button
          onClick={onClose}
          className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
        >
          <X className="h-5 w-5 text-gray-500" />
        </button>
      </div>

      {!useManualInput ? (
        <div className="space-y-4">
          {/* Camera placeholder */}
          <div className="relative bg-gray-900 rounded-lg h-64 flex items-center justify-center">
            <div className="text-center text-white">
              <Camera className="h-16 w-16 mx-auto mb-4 opacity-50" />
              <p className="text-sm opacity-75 mb-4">Camera view would appear here</p>
              <button
                onClick={simulateQRCode}
                disabled={loading}
                className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium transition-colors disabled:opacity-50"
              >
                {loading ? (
                  <Loader2 className="h-4 w-4 animate-spin mx-auto" />
                ) : (
                  'Simulate QR Scan'
                )}
              </button>
            </div>
            
            {/* Scanning overlay */}
            <div className="absolute inset-4 border-2 border-blue-500 rounded-lg">
              <div className="absolute inset-0 border border-blue-300 rounded-lg animate-pulse" />
            </div>
          </div>

          <div className="text-center">
            <button
              onClick={() => setUseManualInput(true)}
              className="text-blue-600 hover:text-blue-700 font-medium text-sm inline-flex items-center"
            >
              <Type className="h-4 w-4 mr-1" />
              Enter QR code manually instead
            </button>
          </div>
        </div>
      ) : (
        <form onSubmit={handleManualSubmit} className="space-y-4">
          <div>
            <label htmlFor="qr-input" className="block text-sm font-medium text-gray-700 mb-2">
              Enter QR Code Data
            </label>
            <input
              id="qr-input"
              type="text"
              value={manualInput}
              onChange={(e) => setManualInput(e.target.value)}
              placeholder="Paste or type the QR code data here"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
          
          <div className="flex space-x-3">
            <button
              type="submit"
              disabled={!manualInput.trim() || loading}
              className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-lg font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? (
                <Loader2 className="h-4 w-4 animate-spin mx-auto" />
              ) : (
                'Submit'
              )}
            </button>
            <button
              type="button"
              onClick={() => setUseManualInput(false)}
              className="px-4 py-3 text-gray-600 hover:text-gray-800 font-medium"
            >
              Use Camera
            </button>
          </div>
        </form>
      )}

      <div className="text-center text-sm text-gray-500">
        <p>Point your camera at the QR code or enter the code manually</p>
      </div>
    </div>
  );
}