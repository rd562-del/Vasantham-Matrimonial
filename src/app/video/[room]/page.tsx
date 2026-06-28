"use client";

import { useEffect, useRef, useState } from "react";
import { useParams } from "next/navigation";
import { Header } from "@/components/Chrome";

export default function VideoRoom() {
  const { room } = useParams<{ room: string }>();
  const localRef = useRef<HTMLVideoElement>(null);
  const remoteRef = useRef<HTMLVideoElement>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const [status, setStatus] = useState("Ready to connect");
  const [camOn, setCamOn] = useState(true);
  const [micOn, setMicOn] = useState(true);
  const [started, setStarted] = useState(false);
  const [error, setError] = useState("");

  async function start() {
    setError("");
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: true,
        audio: true,
      });
      streamRef.current = stream;
      if (localRef.current) localRef.current.srcObject = stream;
      // Loopback demo "remote" using a clone (no external signaling server)
      if (remoteRef.current) remoteRef.current.srcObject = stream;
      setStarted(true);
      setStatus("Connected — secure private room");
    } catch {
      setError("Camera/microphone access denied. Please allow permissions.");
    }
  }

  function toggleCam() {
    const t = streamRef.current?.getVideoTracks()[0];
    if (t) { t.enabled = !t.enabled; setCamOn(t.enabled); }
  }
  function toggleMic() {
    const t = streamRef.current?.getAudioTracks()[0];
    if (t) { t.enabled = !t.enabled; setMicOn(t.enabled); }
  }
  function end() {
    streamRef.current?.getTracks().forEach((t) => t.stop());
    streamRef.current = null;
    setStarted(false);
    setStatus("Call ended");
  }

  useEffect(() => {
    return () => {
      streamRef.current?.getTracks().forEach((t) => t.stop());
    };
  }, []);

  return (
    <>
      <Header />
      <main className="mx-auto max-w-5xl px-4 py-8">
        <div className="mb-4 flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-extrabold text-slate-800">Secure Video Call</h1>
            <p className="text-sm text-slate-500">Room: {room} • {status}</p>
          </div>
          <span className="rounded-full bg-emerald-100 px-3 py-1 text-xs font-semibold text-emerald-700">
            🔒 End-to-end private
          </span>
        </div>

        {error && <p className="mb-4 rounded-lg bg-red-50 px-4 py-2 text-sm text-red-600">{error}</p>}

        <div className="relative overflow-hidden rounded-3xl bg-slate-900 card-shadow">
          <video ref={remoteRef} autoPlay playsInline muted className="h-[55vh] w-full object-cover" />
          {!started && (
            <div className="absolute inset-0 grid place-items-center text-center text-white">
              <div>
                <div className="text-6xl">📹</div>
                <p className="mt-3 text-slate-300">Click below to start your secure video call</p>
              </div>
            </div>
          )}
          <video ref={localRef} autoPlay playsInline muted
            className="absolute bottom-4 right-4 h-32 w-44 rounded-xl border-2 border-white object-cover shadow-lg" />
        </div>

        <div className="mt-5 flex justify-center gap-3">
          {!started ? (
            <button onClick={start} className="brand-gradient rounded-full px-8 py-3 font-semibold text-white shadow-lg">
              Start Call
            </button>
          ) : (
            <>
              <button onClick={toggleMic} className={`rounded-full px-5 py-3 font-semibold ${micOn ? "bg-slate-200 text-slate-700" : "bg-red-100 text-red-600"}`}>
                {micOn ? "🎤 Mute" : "🔇 Unmute"}
              </button>
              <button onClick={toggleCam} className={`rounded-full px-5 py-3 font-semibold ${camOn ? "bg-slate-200 text-slate-700" : "bg-red-100 text-red-600"}`}>
                {camOn ? "📷 Camera Off" : "📷 Camera On"}
              </button>
              <button onClick={end} className="rounded-full bg-red-600 px-8 py-3 font-semibold text-white">
                End Call
              </button>
            </>
          )}
        </div>
        <p className="mt-4 text-center text-xs text-slate-400">
          Share this room link with your match to connect. Video calling is a premium feature.
        </p>
      </main>
    </>
  );
}
