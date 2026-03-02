import { useState, useRef, useEffect } from "react";
import { Camera, CameraOff } from "lucide-react";
import Button from "../common/Button";
import { moodService } from "../../services/moodService.js";

const CameraDetection = ({ onDetect }) => {
  const [active, setActive] = useState(false);
  const [detecting, setDetecting] = useState(false);
  const [error, setError] = useState(null);
  const [snapshot, setSnapshot] = useState(null);

  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const streamRef = useRef(null);

  // ========================
  // Start Camera
  // ========================
  const startCamera = async () => {
    setError(null);
    setSnapshot(null);

    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: {
          facingMode: "user",
          width: { ideal: 1280 },
          height: { ideal: 720 },
        },
      });

      streamRef.current = stream;

      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }

      setActive(true);
    } catch (err) {
      const messages = {
        NotAllowedError: "Camera access was denied. Please allow permissions.",
        NotFoundError: "No camera found.",
        NotReadableError: "Camera is already in use by another application.",
      };

      setError(
        messages[err.name] || "Could not access the camera. Please try again.",
      );
    }
  };

  // ========================
  // Stop Camera
  // ========================
  const stopCamera = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => track.stop());
      streamRef.current = null;
    }

    if (videoRef.current) {
      videoRef.current.srcObject = null;
    }

    setActive(false);
    setDetecting(false);
    setSnapshot(null);
    setError(null);
  };

  const handleToggle = () => {
    active ? stopCamera() : startCamera();
  };

  // ========================
  // Capture Snapshot
  // ========================
  const captureSnapshot = () => {
    const video = videoRef.current;
    const canvas = canvasRef.current;

    if (!video || !canvas) return null;

    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;

    const ctx = canvas.getContext("2d");

    // Mirror image for natural selfie
    ctx.translate(canvas.width, 0);
    ctx.scale(-1, 1);
    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

    const dataUrl = canvas.toDataURL("image/jpeg", 0.95);
    setSnapshot(dataUrl);

    return dataUrl;
  };

  // ========================
  // Detect Mood
  // ========================
  const handleDetect = async () => {
    setDetecting(true);
    setError(null);

    try {
      const dataUrl = captureSnapshot();
      if (!dataUrl) throw new Error("Failed to capture snapshot.");

      const blob = await (await fetch(dataUrl)).blob();

      const formData = new FormData();
      formData.append("image", blob, "snapshot.jpg");

      const result = await moodService.analyzeMood(formData);

      console.log("Detection result:", result);

      if (!result.success) {
        throw new Error(result.message || "Mood detection failed");
      }

      // Pass clean data upward
      onDetect?.({
        emotion: result.data.moodLabel,
        score: result.data.mood,
        id: result.data.id,
        createdAt: result.data.createdAt,
      });

      // Optional: Stop camera after detection
      stopCamera();
    } catch (err) {
      setError(`Detection failed: ${err.message}`);
      setSnapshot(null);
    } finally {
      setDetecting(false);
    }
  };

  useEffect(() => {
    return () => stopCamera();
  }, []);

  return (
    <div className="rounded-2xl p-5">
      <h3 className="text-sm font-semibold text-text-primary mb-1">
        Camera Mood Detection
      </h3>
      <p className="text-xs text-text-muted mb-4">
        Let our AI detect your current mood through facial expression analysis
      </p>

      <div
        className={`relative w-full aspect-video rounded-xl overflow-hidden flex items-center justify-center ${
          active ? "bg-gray-900" : "bg-surface-raised"
        } transition-colors duration-300`}
      >
        <video
          ref={videoRef}
          autoPlay
          playsInline
          muted
          className={`absolute inset-0 w-full h-full object-cover scale-x-[-1] ${
            active && !snapshot ? "block" : "hidden"
          }`}
        />

        {snapshot && (
          <img
            src={snapshot}
            alt="Captured snapshot"
            className="absolute inset-0 w-full h-full object-cover"
          />
        )}

        {detecting && (
          <div className="absolute inset-0 flex items-center justify-center bg-black/40">
            <p className="text-emerald-300 text-sm">
              Analyzing your expression...
            </p>
          </div>
        )}

        {!active && !error && (
          <div className="text-center p-6">
            <CameraOff size={32} className="text-emerald-400 mx-auto mb-3" />
            <p className="text-sm text-text-secondary">Camera is off</p>
          </div>
        )}

        {error && !active && (
          <div className="text-center p-6">
            <p className="text-sm text-red-400">{error}</p>
          </div>
        )}
      </div>

      {error && active && <p className="text-xs text-red-400 mt-2">{error}</p>}

      <canvas ref={canvasRef} className="hidden" />

      <div className="flex gap-3 mt-4">
        <Button
          variant={active ? "danger" : "primary"}
          size="sm"
          icon={active ? CameraOff : Camera}
          onClick={handleToggle}
        >
          {active ? "Turn Off" : "Enable Camera"}
        </Button>

        {active && (
          <Button
            variant="secondary"
            size="sm"
            onClick={handleDetect}
            disabled={detecting}
          >
            {detecting ? "Detecting..." : "Detect Mood"}
          </Button>
        )}
      </div>
    </div>
  );
};

export default CameraDetection;
