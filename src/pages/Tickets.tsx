import React from 'react';
import { Link } from 'react-router-dom';
import { useQuery } from "convex/react";
import { api } from "../../convex/_generated/api";
import { useAuth } from '../context/AuthContext';
import { Ticket, Calendar, MapPin, ArrowRight } from 'lucide-react';

export function Tickets() {
  const { isAuthenticated, convexUserId } = useAuth();
  const events = useQuery(api.events.list, {});
  const registeredEvents = convexUserId ? useQuery(api.events.getRegisteredEvents, { userId: convexUserId as any }) : undefined;

  if (!isAuthenticated) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] text-center px-4">
        <Ticket size={64} className="text-byl-dark/20 mb-6" />
        <h1 className="font-serif text-4xl font-bold mb-4">Sign in to view your tickets</h1>
        <Link to="/login" className="bg-byl-dark text-byl-light px-8 py-4 text-[11px] uppercase tracking-widest font-bold hover:bg-byl-purple">Sign In</Link>
      </div>
    );
  }

  const tickets = (registeredEvents ?? []).filter(Boolean);

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-10 py-12 md:py-20">
      <div className="mb-12">
        <span className="text-[10px] uppercase tracking-widest font-black text-byl-purple mb-4 block">Your Collection</span>
        <h1 className="font-serif text-4xl md:text-6xl font-black tracking-tight text-byl-dark">My Tickets</h1>
      </div>

      {tickets.length === 0 ? (
        <div className="text-center py-20 border border-byl-dark/10">
          <Ticket size={48} className="mx-auto text-byl-dark/20 mb-6" />
          <p className="text-byl-dark/50 font-medium mb-4">No tickets yet.</p>
          <Link to="/live" className="text-byl-purple underline text-sm font-bold">Browse events</Link>
        </div>
      ) : (
        <div className="space-y-6">
          {tickets.map((event: any) => (
            <Link key={event._id} to={`/tickets/${event._id}`} className="flex items-center justify-between p-8 bg-byl-light border border-byl-dark/10 hover:border-byl-dark group transition-all">
              <div className="flex items-center gap-6">
                <img src={event.imageUrl} alt={event.title} className="w-20 h-20 object-cover grayscale group-hover:grayscale-0 transition-all" />
                <div>
                  <span className="text-[10px] uppercase font-bold text-byl-purple">{event.category}</span>
                  <h3 className="font-serif font-bold text-xl mt-1 group-hover:text-byl-purple transition-colors">{event.title}</h3>
                  <div className="flex items-center gap-4 mt-2 text-[10px] uppercase tracking-widest font-bold text-byl-dark/40">
                    <span className="flex items-center"><Calendar size={12} className="mr-1" />{event.date}</span>
                    <span className="flex items-center"><MapPin size={12} className="mr-1" />{event.location}</span>
                  </div>
                </div>
              </div>
              <ArrowRight size={20} className="text-byl-dark/20 group-hover:text-byl-purple transition-colors" />
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}