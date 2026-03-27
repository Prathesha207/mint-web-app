"use client";
import { Brain, Cloud, CloudCheck, CloudOff, Database, Menu, RefreshCw } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
interface HeaderProps {
  isMobile: boolean;
  showMobileSidebar: boolean;
  setShowMobileSidebar: React.Dispatch<React.SetStateAction<boolean>>;
  checkBackendConnection: () => Promise<boolean>;
  checkOakCameraConnection: () => Promise<"streaming" | "idle" | "error">;
  backendConnected: boolean;
}
export default function Header({ isMobile, showMobileSidebar, setShowMobileSidebar, checkBackendConnection, checkOakCameraConnection, backendConnected }: HeaderProps) {
  const pathname = usePathname();
  const [isChecking, setIsChecking] = useState(false);
  const [checkResult, setCheckResult] = useState<"success" | "error" | null>(null);
  const handleReconnect = async () => {
    setIsChecking(true);
    setCheckResult(null);

    const startTime = Date.now();

    try {
      const [backendOk, oakStatus] = await Promise.all([
        checkBackendConnection(),
        checkOakCameraConnection(),
      ]);

      const success =
        backendOk === true && oakStatus !== "error";

      setCheckResult(success ? "success" : "error");

    } catch {
      setCheckResult("error");
    } finally {
      const elapsed = Date.now() - startTime;
      const minDuration = 800; // 👈 minimum spinner time

      setTimeout(() => {
        setIsChecking(false);

        setTimeout(() => {
          setCheckResult(null);
        }, 1500);

      }, Math.max(minDuration - elapsed, 0));
    }
  };
  return (
    <div className="z-50 backdrop-blur-xl border-b border-neutral-800/50 p-2 flex items-center justify-between flex-none">
      <div className="flex items-center space-x-3">
        <div className="w-9  h-9 bg-gradient-to-br from-blue-600 to-cyan-500 rounded-lg flex items-center justify-center">
          <Brain className="w-6 h-6 text-white" />
        </div>
        <div>
          <h1 className="text-lg font-semibold tracking-tight text-white">  Vision AI Training</h1>
          <p className="text-[10px] text-neutral-500 font-mono uppercase ">  Real-time ROI Detection</p>

        </div>
      </div>
      <div className="flex items-center space-x-3 md:space-x-3">

        {isMobile ? <button
          onClick={() => setShowMobileSidebar(!showMobileSidebar)}
          className="p-2 bg-neutral-800 hover:bg-neutral-700 rounded"
        >
          <Menu className="w-5 h-5" />
        </button> :
          <>
            {/* <Link
              href="/"
              className={`nav-link `}
            >
              Home
            </Link>
            <Link
              href="/training1"
              className={`nav-link ${pathname === "/training1" ? "active" : ""}`}
            >
              Training
            </Link>
            <Link
              href="/inference1"
              className={`nav-link ${pathname === "/inference1" ? "active" : ""}`}
            >
              Inference
            </Link> */}
            {/* <div
              className={`flex items-center gap-2 px-2 py-1 rounded-md border ${backendConnected
                ? 'bg-blue-500/20 border-blue-500/30 text-blue-300'
                : 'bg-red-500/20 border-red-500/30 text-red-300'
                }`}
            >
              {backendConnected ? (
                <Cloud className="w-5 h-5" />
              ) : (
                <CloudOff className="w-5 h-5" />
              )}
              <span className="text-xs font-semibold">
                {backendConnected ? 'Connected' : 'Disconnected'}
              </span>
            </div> */}
            <div
              className={`flex items-center justify-center w-8 h-8 rounded-full border ${backendConnected
                ? 'bg-blue-600/20 border-none text-blue-400 '
                : 'bg-rose-500/20 border-none text-rose-400'
                }`}
            >
              {backendConnected ? <CloudCheck className="w-5 h-5" /> : <CloudOff className="w-5 h-5" />}
            </div>
            <button
              onClick={handleReconnect}
              disabled={isChecking}
              className="flex items-center gap-2 px-2 py-1.5 rounded-md text-sm  bg-neutral-800 hover:bg-neutral-700  disabled:opacity-60 disabled:cursor-not-allowed transition-all duration-200"
            >
              <RefreshCw
                className={`w-4 h-4 ${isChecking
                  ? "animate-spin text-blue-400" : ""}`}
              />
              <span className="min-w-[65px] text-center">
                {isChecking
                  ? "Checking"
                  : checkResult === "success"
                    ? "Connected"
                    : checkResult === "error"
                      ? "Failed"
                      : "Reconnect"}
              </span>
            </button>

          </>

        }

      </div>

    </div>

  );
}






