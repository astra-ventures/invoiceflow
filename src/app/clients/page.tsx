"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { getClients, deleteClient, type Client } from "@/lib/storage";

export default function ClientsPage() {
  const [clients, setClients] = useState<Client[]>([]);

  useEffect(() => {
    setClients(getClients());
  }, []);

  const handleDelete = (id: string) => {
    if (confirm("Delete this client?")) {
      deleteClient(id);
      setClients(getClients());
    }
  };

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header */}
      <header className="bg-white border-b border-slate-200">
        <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
          <Link href="/" className="text-2xl font-bold text-slate-900">
            Invoice<span className="text-blue-600">Flow</span>
          </Link>
          <div className="flex items-center gap-4">
            <Link
              href="/history"
              className="text-slate-600 hover:text-slate-900"
            >
              History
            </Link>
            <Link
              href="/create"
              className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition"
            >
              + New Invoice
            </Link>
          </div>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-6 py-8">
        <h1 className="text-2xl font-bold text-slate-900 mb-6">
          Saved Clients
        </h1>

        {clients.length === 0 ? (
          <div className="bg-white rounded-xl border border-slate-200 p-12 text-center">
            <div className="text-4xl mb-4">👥</div>
            <h2 className="text-xl font-semibold text-slate-900 mb-2">
              No saved clients
            </h2>
            <p className="text-slate-600 mb-6">
              Clients are saved when you create invoices with "Save client" checked
            </p>
            <Link
              href="/create"
              className="inline-block bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition"
            >
              Create Invoice
            </Link>
          </div>
        ) : (
          <div className="grid gap-4">
            {clients.map((client) => (
              <div
                key={client.id}
                className="bg-white rounded-xl border border-slate-200 p-6 flex items-start justify-between"
              >
                <div>
                  <h3 className="font-semibold text-slate-900 text-lg">
                    {client.name}
                  </h3>
                  {client.email && (
                    <p className="text-slate-600 mt-1">{client.email}</p>
                  )}
                  {client.address && (
                    <p className="text-slate-500 text-sm mt-2 whitespace-pre-line">
                      {client.address}
                    </p>
                  )}
                  <p className="text-slate-400 text-xs mt-3">
                    Added {formatDate(client.createdAt)}
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <Link
                    href={`/create?client=${client.id}`}
                    className="text-blue-600 hover:text-blue-700 text-sm font-medium"
                  >
                    New Invoice
                  </Link>
                  <button
                    onClick={() => handleDelete(client.id)}
                    className="text-red-500 hover:text-red-700 text-sm"
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
