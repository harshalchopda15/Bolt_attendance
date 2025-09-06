import React, { useState, useRef } from 'react';
import { Camera, X, Loader2, Type, AlertCircle, CheckCircle } from 'lucide-react';

interface QRScannerProps {
  onResult: (data: string) => void;
  onClose: () => void;
  loading: boolean;
}

export default function QRScanner({ onResult, onClose, loading }: QRScannerProps) {
  const [manualInput, setManualInput] = useState('');
  const [useManualInput, setUseManualInput] = useState(false);
  const [cameraError, setCameraError] = useState<string>('');
  const [cameraStream, setCameraStream] = useState<MediaStream | null>(null);
  const [isScanning, setIsScanning] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);

  const startCamera = async () => {
    try {
      setCameraError('');
      const stream = await navigator.mediaDevices.getUserMedia({ 
        video: { 
          facingMode: 'environment', // Use back camera if available
          width: { ideal: 640 },
          height: { ideal: 480 }
        } 
      });
      
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        setCameraStream(stream);
        setIsScanning(true);
      }
    } catch (error) {
      console.error('Camera access error:', error);
      setCameraError('Unable to access camera. Please check permissions or use manual input.');
      setUseManualInput(true);
    }
  };

  const stopCamera = () => {
    if (cameraStream) {
      cameraStream.getTracks().forEach(track => track.stop());
      setCameraStream(null);
      setIsScanning(false);
    }
  };

  React.useEffect(() => {
    if (!useManualInput && !cameraStream) {
      startCamera();
    }
    
    return () => {
      stopCamera();
    };
  }, [useManualInput]);
  const handleManualSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (manualInput.trim()) {
      onResult(manualInput.trim());
      setManualInput('');
    }
  };

  const simulateQRCode = () => {
    // Simulate scanning a QR code for demo purposes
    const mockQRData = `ATTENDANCE_${Date.now()}_TEACHER_2_CLASS_MATH101`;
    onResult(mockQRData);
  };

  const handleCameraToggle = () => {
    if (useManualInput) {
      setUseManualInput(false);
      setCameraError('');
    } else {
      setUseManualInput(true);
      stopCamera();
    }
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
          {cameraError ? (
            <div className="bg-red-50 border border-red-200 text-red-700 p-4 rounded-lg">
              <div className="flex items-center">
                <AlertCircle className="h-5 w-5 mr-2" />
                <p className="text-sm">{cameraError}</p>
              </div>
            </div>
          ) : (
            <div className="relative bg-gray-900 rounded-lg h-64 overflow-hidden">
              <video
                ref={videoRef}
                autoPlay
                playsInline
                muted
                className="w-full h-full object-cover"
              />
              
              {/* Scanning overlay */}
              <div className="absolute inset-4 border-2 border-blue-500 rounded-lg">
                <div className="absolute inset-0 border border-blue-300 rounded-lg animate-pulse" />
              </div>
              
              {/* Controls overlay */}
              <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2">
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
              
              {!isScanning && (
                <div className="absolute inset-0 bg-gray-900 bg-opacity-75 flex items-center justify-center">
                  <div className="text-center text-white">
                    <Camera className="h-16 w-16 mx-auto mb-4 opacity-50" />
                    <p className="text-sm opacity-75">Starting camera...</p>
                  </div>
                </div>
              )}
            </div>
          )}

          <div className="text-center">
            <button
              onClick={handleCameraToggle}
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
             onClick={handleCameraToggle}
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