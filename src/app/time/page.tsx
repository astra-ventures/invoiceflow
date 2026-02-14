"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { AppNavbar } from "../_components/AppNavbar";
import {
  getTimeEntries,
  saveTimeEntry,
  deleteTimeEntry,
  updateTimeEntry,
  getClients,
  getUnbilledTimeEntries,
  formatDuration,
  type TimeEntry,
  type Client,
} from "@/lib/storage";

export default function TimeTrackingPage() {
  const [entries, setEntries] = useState<TimeEntry[]>([]);
  const [clients, setClients] = useState<Client[]>([]);
  const [isTracking, setIsTracking] = useState(false);
  const [currentEntry, setCurrentEntry] = useState<Partial<TimeEntry>>({
    clientName: "",
    projectName: "",
    description: "",
    hourlyRate: 50,
  });
  const [startTime, setStartTime] = useState<Date | null>(null);
  const [elapsedSeconds, setElapsedSeconds] = useState(0);
  const [filter, setFilter] = useState<"all" | "unbilled" | "billed">("all");
  const [selectedClient, setSelectedClient] = useState<string>("");
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  // Load data
  useEffect(() => {
    setEntries(getTimeEntries());
    setClients(getClients());
  }, []);

  // Timer effect
  useEffect(() => {
    if (isTracking && startTime) {
      intervalRef.current = setInterval(() => {
        setElapsedSeconds(Math.floor((Date.now() - startTime.getTime()) / 1000));
      }, 1000);
    } else {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    }
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [isTracking, startTime]);

  const startTimer = () => {
    if (!currentEntry.description) {
      alert("Please enter a description");
      return;
    }
    setStartTime(new Date());
    setIsTracking(true);
    setElapsedSeconds(0);
  };

  const stopTimer = () => {
    if (!startTime) return;
    
    const endTime = new Date();
    const durationMinutes = Math.ceil((endTime.getTime() - startTime.getTime()) / 60000);
    
    const entry = saveTimeEntry({
      clientId: clients.find((c) => c.name === currentEntry.clientName)?.id,
      clientName: currentEntry.clientName || "No Client",
      projectName: currentEntry.projectName || "",
      description: currentEntry.description || "",
      startTime: startTime.toISOString(),
      endTime: endTime.toISOString(),
      durationMinutes,
      hourlyRate: currentEntry.hourlyRate || 0,
      isBilled: false,
    });

    setEntries([entry, ...entries]);
    setIsTracking(false);
    setStartTime(null);
    setElapsedSeconds(0);
    setCurrentEntry({
      ...currentEntry,
      description: "",
      projectName: "",
    });
  };

  const addManualEntry = () => {
    const durationMinutes = parseInt(prompt("Duration in minutes:") || "0", 10);
    if (!durationMinutes || !currentEntry.description) {
      alert("Please enter duration and description");
      return;
    }

    const entry = saveTimeEntry({
      clientId: clients.find((c) => c.name === currentEntry.clientName)?.id,
      clientName: currentEntry.clientName || "No Client",
      projectName: currentEntry.projectName || "",
      description: currentEntry.description || "",
      startTime: new Date().toISOString(),
      durationMinutes,
      hourlyRate: currentEntry.hourlyRate || 0,
      isBilled: false,
    });

    setEntries([entry, ...entries]);
    setCurrentEntry({
      ...currentEntry,
      description: "",
      projectName: "",
    });
  };

  const handleDelete = (id: string) => {
    if (confirm("Delete this time entry?")) {
      deleteTimeEntry(id);
      setEntries(entries.filter((e) => e.id !== id));
    }
  };

  const toggleBilled = (id: string) => {
    const entry = entries.find((e) => e.id === id);
    if (entry) {
      updateTimeEntry(id, { isBilled: !entry.isBilled });
      setEntries(
        entries.map((e) => (e.id === id ? { ...e, isBilled: !e.isBilled } : e))
      );
    }
  };

  const formatTime = (seconds: number) => {
    const h = Math.floor(seconds / 3600);
    const m = Math.floor((seconds % 3600) / 60);
    const s = seconds % 60;
    return `${h.toString().padStart(2, "0")}:${m.toString().padStart(2, "0")}:${s
      .toString()
      .padStart(2, "0")}`;
  };

  // Filter entries
  let filteredEntries = entries;
  if (filter === "unbilled") {
    filteredEntries = entries.filter((e) => !e.isBilled);
  } else if (filter === "billed") {
    filteredEntries = entries.filter((e) => e.isBilled);
  }
  if (selectedClient) {
    filteredEntries = filteredEntries.filter((e) => e.clientName === selectedClient);
  }

  // Calculate totals
  const unbilledEntries = getUnbilledTimeEntries();
  const unbilledTotal = unbilledEntries.reduce(
    (sum, e) => sum + (e.durationMinutes / 60) * e.hourlyRate,
    0
  );
  const unbilledHours = unbilledEntries.reduce((sum, e) => sum + e.durationMinutes, 0);

  return (
    <div className="min-h-screen bg-[#0A0F1E]">
      <AppNavbar />
      
      <main className="max-w-4xl mx-auto px-6 pt-24 pb-8">
        <h1 className="text-2xl font-bold text-white mb-8">Time Tracking</h1>

        {/* Timer Card */}
        <div className="bg-[#111827] rounded-xl border border-white/20 p-6 mb-8">
          <div className="flex flex-col md:flex-row gap-6">
            {/* Timer Display */}
            <div className="flex-shrink-0 text-center md:text-left">
              <div
                className={`text-5xl font-mono font-bold ${
                  isTracking ? "text-green-600" : "text-slate-300"
                }`}
              >
                {formatTime(elapsedSeconds)}
              </div>
              <div className="mt-4 flex gap-2 justify-center md:justify-start">
                {!isTracking ? (
                  <>
                    <button
                      onClick={startTimer}
                      className="bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700 transition flex items-center gap-2"
                    >
                      ▶ Start
                    </button>
                    <button
                      onClick={addManualEntry}
                      className="text-[#9CA3AF] px-4 py-2 rounded-lg border border-white/20 hover:bg-slate-50 transition"
                    >
                      + Manual
                    </button>
                  </>
                ) : (
                  <button
                    onClick={stopTimer}
                    className="bg-red-600 text-white px-6 py-2 rounded-lg hover:bg-red-700 transition flex items-center gap-2"
                  >
                    ⏹ Stop
                  </button>
                )}
              </div>
            </div>

            {/* Entry Form */}
            <div className="flex-1 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm text-[#9CA3AF] mb-1">Client</label>
                  <select
                    value={currentEntry.clientName}
                    onChange={(e) =>
                      setCurrentEntry({ ...currentEntry, clientName: e.target.value })
                    }
                    className="w-full px-3 py-2 rounded-lg border border-white/20 focus:border-blue-500 outline-none"
                    disabled={isTracking}
                  >
                    <option value="">No Client</option>
                    {clients.map((c) => (
                      <option key={c.id} value={c.name}>
                        {c.name}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm text-[#9CA3AF] mb-1">
                    Hourly Rate ($)
                  </label>
                  <input
                    type="number"
                    value={currentEntry.hourlyRate}
                    onChange={(e) =>
                      setCurrentEntry({
                        ...currentEntry,
                        hourlyRate: parseFloat(e.target.value) || 0,
                      })
                    }
                    className="w-full px-3 py-2 rounded-lg border border-white/20 focus:border-blue-500 outline-none"
                    disabled={isTracking}
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm text-[#9CA3AF] mb-1">Project</label>
                <input
                  type="text"
                  value={currentEntry.projectName}
                  onChange={(e) =>
                    setCurrentEntry({ ...currentEntry, projectName: e.target.value })
                  }
                  placeholder="e.g., Website Redesign"
                  className="w-full px-3 py-2 rounded-lg border border-white/20 focus:border-blue-500 outline-none"
                  disabled={isTracking}
                />
              </div>
              <div>
                <label className="block text-sm text-[#9CA3AF] mb-1">
                  What are you working on? *
                </label>
                <input
                  type="text"
                  value={currentEntry.description}
                  onChange={(e) =>
                    setCurrentEntry({ ...currentEntry, description: e.target.value })
                  }
                  placeholder="e.g., Homepage mockup design"
                  className="w-full px-3 py-2 rounded-lg border border-white/20 focus:border-blue-500 outline-none"
                  disabled={isTracking}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Unbilled Summary */}
        {unbilledEntries.length > 0 && (
          <div className="bg-amber-50 border border-amber-100 rounded-xl p-4 mb-6 flex items-center justify-between">
            <div>
              <div className="font-medium text-amber-900">
                {formatDuration(unbilledHours)} unbilled time
              </div>
              <div className="text-sm text-amber-700">
                Worth ${unbilledTotal.toFixed(2)} across {unbilledEntries.length} entries
              </div>
            </div>
            <Link
              href="/create"
              className="bg-amber-600 text-white px-4 py-2 rounded-lg hover:bg-amber-700 transition text-sm"
            >
              Create Invoice →
            </Link>
          </div>
        )}

        {/* Filters */}
        <div className="flex flex-wrap items-center gap-4 mb-4">
          <div className="flex bg-slate-100 rounded-lg p-1">
            {(["all", "unbilled", "billed"] as const).map((f) => (
              <button
                key={f}
                onClick={() => setFilter(f)}
                className={`px-4 py-1.5 rounded-md text-sm transition ${
                  filter === f
                    ? "bg-[#111827] text-white shadow-sm"
                    : "text-[#9CA3AF] hover:text-white"
                }`}
              >
                {f.charAt(0).toUpperCase() + f.slice(1)}
              </button>
            ))}
          </div>
          <select
            value={selectedClient}
            onChange={(e) => setSelectedClient(e.target.value)}
            className="px-3 py-2 rounded-lg border border-white/20 text-sm"
          >
            <option value="">All Clients</option>
            {[...new Set(entries.map((e) => e.clientName))].map((name) => (
              <option key={name} value={name}>
                {name}
              </option>
            ))}
          </select>
        </div>

        {/* Time Entries List */}
        <div className="space-y-2">
          {filteredEntries.length === 0 ? (
            <div className="bg-[#111827] rounded-xl border border-white/20 p-12 text-center">
              <div className="text-4xl mb-4">⏱️</div>
              <h3 className="text-lg font-medium text-white mb-2">
                No time entries yet
              </h3>
              <p className="text-slate-500">
                Start the timer or add a manual entry to track your work.
              </p>
            </div>
          ) : (
            filteredEntries.map((entry) => (
              <div
                key={entry.id}
                className={`bg-[#111827] rounded-lg border p-4 flex items-center gap-4 ${
                  entry.isBilled ? "border-slate-100 bg-slate-50" : "border-white/20"
                }`}
              >
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="font-medium text-white truncate">
                      {entry.description}
                    </span>
                    {entry.isBilled && (
                      <span className="text-xs bg-green-100 text-green-700 px-2 py-0.5 rounded">
                        Billed
                      </span>
                    )}
                  </div>
                  <div className="text-sm text-slate-500 mt-1">
                    {entry.clientName}
                    {entry.projectName && ` • ${entry.projectName}`}
                    {" • "}
                    {new Date(entry.startTime).toLocaleDateString()}
                  </div>
                </div>
                <div className="text-right">
                  <div className="font-mono font-medium text-white">
                    {formatDuration(entry.durationMinutes)}
                  </div>
                  <div className="text-sm text-slate-500">
                    ${((entry.durationMinutes / 60) * entry.hourlyRate).toFixed(2)}
                  </div>
                </div>
                <div className="flex items-center gap-1">
                  <button
                    onClick={() => toggleBilled(entry.id)}
                    className={`p-2 rounded hover:bg-slate-100 transition ${
                      entry.isBilled ? "text-green-600" : "text-slate-400"
                    }`}
                    title={entry.isBilled ? "Mark unbilled" : "Mark billed"}
                  >
                    {entry.isBilled ? "✓" : "○"}
                  </button>
                  <button
                    onClick={() => handleDelete(entry.id)}
                    className="p-2 rounded text-slate-400 hover:text-red-600 hover:bg-red-50 transition"
                  >
                    ×
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </main>
    </div>
  );
}
