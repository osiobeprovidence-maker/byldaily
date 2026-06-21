import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { useQuery } from "convex/react";
import { api } from "../../convex/_generated/api";
import { useAuth } from '../context/AuthContext';
import { ArrowLeft, Calendar, MapPin, Clock, Ticket } from 'lucide-react';

export function TicketDetail() {
  const { ticketId } = useParams<{ ticketId: string }>();
  const { convexUserId } = useAuth();
  const event = useQuery(api.events.getById, ticketId ? { id: ticketId as any } : "skip");
  const registration = (event && convexUserId) ? useQuery(api.events.getRegistration, { eventId: event._id as any, userId: convexUserId as any }) : undefined;

  if (!event) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-20">
        <div className="animate-pulse space-y-8">
          <div className="h-8 w-20 bg-byl-dark/5" />
          <div className="h-64 bg-byl-dark/5" />
          <div className="h-6 w-2/3 bg-byl-dark/5" />
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto px-4 py-12 md:py-20">
      <Link to="/tickets" className="flex items-center text-[11px] uppercase tracking-widest font-bold text-byl-dark/40 hover:text-byl-dark mb-10">
        <ArrowLeft size={14} className="mr-2" />My Tickets
      </Link>

      <div className="border-2 border-byl-dark p-10 md:p-16 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-32 h-32 bg-byl-dark/5 rounded-bl-full" />
        <div className="absolute bottom-0 left-0 w-32 h-32 bg-byl-dark/5 rounded-tr-full" />

        <div className="relative z-10">
          <div className="flex items-center justify-between mb-10 border-b border-byl-dark/10 pb-8">
            <div>
              <span className="text-[10px] uppercase tracking-widest font-black text-byl-purple">Admit One</span>
              <h1 className="font-serif text-3xl md:text-4xl font-black mt-2 text-byl-dark">{event.title}</h1>
            </div>
            <Ticket size={48} className="text-byl-dark/10" />
          </div>

          <div className="grid grid-cols-2 gap-8 mb-10">
            <div>
              <p className="text-[9px] uppercase tracking-widest font-black text-byl-dark/40 mb-1">Date</p>
              <p className="font-bold flex items-center gap-2"><Calendar size={14} />{event.date}</p>
            </div>
            <div>
              <p className="text-[9px] uppercase tracking-widest font-black text-byl-dark/40 mb-1">Time</p>
              <p className="font-bold flex items-center gap-2"><Clock size={14} />{event.time}</p>
            </div>
            <div className="col-span-2">
              <p className="text-[9px] uppercase tracking-widest font-black text-byl-dark/40 mb-1">Location</p>
              <p className="font-bold flex items-center gap-2"><MapPin size={14} />{event.location}</p>
            </div>
          </div>

          {registration && (
            <div className="border-t border-byl-dark/10 pt-8">
              <p className="text-[9px] uppercase tracking-widest font-black text-byl-dark/40 mb-2">Ticket Reference</p>
              <p className="font-mono text-2xl font-black tracking-wider text-byl-purple">{registration.ticketRef}</p>
              <p className="text-[10px] text-byl-dark/40 mt-2 uppercase tracking-widest font-bold">{registration.status}</p>
            </div>
          )}

          <div className="mt-10 pt-8 border-t border-byl-dark/10 text-center">
            <p className="text-[8px] uppercase tracking-[0.3em] font-black text-byl-dark/20">BYLDaily — Experience the Culture</p>
          </div>
        </div>
      </div>
    </div>
  );
}