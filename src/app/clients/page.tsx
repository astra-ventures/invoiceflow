"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { AppNavbar } from "@/app/_components/AppNavbar";
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
    <div className="min-h-screen bg-[#0A0F1E]">
      <AppNavbar />

      <main className="max-w-4xl mx-auto px-6 py-8 pt-24">
        <h1 className="text-2xl font-bold text-white mb-6">
          Saved Clients
        </h1>

        {clients.length === 0 ? (
          <div className="bg-[#111827] rounded-xl border border-white/10 p-12 text-center">
            
            <h2 className="text-xl font-semibold text-white mb-2">
              No saved clients
            </h2>
            <p className="text-[#9CA3AF] mb-6">
              Clients are saved when you create invoices with &quot;Save client&quot; checked
            </p>
            <Link
              href="/create"
              className="inline-block bg-[#6366F1] text-white px-6 py-3 rounded-lg hover:bg-[#818CF8] transition"
            >
              Create Invoice
            </Link>
          </div>
        ) : (
          <div className="grid gap-4">
            {clients.map((client) => (
              <div
                key={client.id}
                className="bg-[#111827] rounded-xl border border-white/10 p-6 flex items-start justify-between"
              >
                <div>
                  <h3 className="font-semibold text-white text-lg">
                    {client.name}
                  </h3>
                  {client.email && (
                    <p className="text-[#9CA3AF] mt-1">{client.email}</p>
                  )}
                  {client.address && (
                    <p className="text-[#9CA3AF] text-sm mt-2 whitespace-pre-line">
                      {client.address}
                    </p>
                  )}
                  <p className="text-[#9CA3AF] text-xs mt-3">
                    Added {formatDate(client.createdAt)}
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <Link
                    href={`/create?client=${client.id}`}
                    className="text-[#6366F1] hover:text-[#818CF8] text-sm font-medium"
                  >
                    New Invoice
                  </Link>
                  <button
                    onClick={() => handleDelete(client.id)}
                    className="text-[#F43F5E] hover:text-[#FB7185] text-sm"
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
