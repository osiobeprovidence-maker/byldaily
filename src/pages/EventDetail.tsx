import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useQuery, useMutation } from "convex/react";
import { api } from "../../convex/_generated/api";
import { useAuth } from '../context/AuthContext';
import { Calendar, MapPin, Clock, ArrowLeft, Star, Users, CheckCircle } from 'lucide-react';

export function EventDetail() {
  const { slug } = useParams<{ slug: string }>();
  const { isAuthenticated, convexUserId } = useAuth();
  const event = useQuery(api.events.getBySlug, slug ? { slug } : "skip");
  const registration = (event && convexUserId) ? useQuery(api.events.getRegistration, { eventId: event._id as any, userId: convexUserId as any }) : undefined;
  const stats = event ? useQuery(api.events.getEventStats, { eventId: event._id as any }) : undefined;

  const register = useMutation(api.events.register);
  const cancelRegistration = useMutation(api.events.cancelRegistration);
  const [registering, setRegistering] = useState(false);

  if (!event) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-20">
        <div className="animate-pulse space-y-10">
          <div className="h-8 w-20 bg-byl-dark/5" />
          <div className="h-96 bg-byl-dark/5" />
          <div className="h-8 w-2/3 bg-byl-dark/5" />
          <div className="h-4 w-1/3 bg-byl-dark/5" />
        </div>
      </div>
    );
  }

  const isRegistered = !!registration;

  const handleRegister = async () => {
    if (!isAuthenticated) return;
    setRegistering(true);
    try {
      if (isRegistered) {
        await cancelRegistration({ eventId: event._id as any });
      } else {
        await register({ eventId: event._id as any });
      }
    } catch (e) { console.error(e); }
    finally { setRegistering(false); }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-12 md:py-20">
      <Link to="/live" className="flex items-center text-[11px] uppercase tracking-widest font-bold text-byl-dark/40 hover:text-byl-dark mb-10">
        <ArrowLeft size={14} className="mr-2" />Back to Events
      </Link>

      <div className="relative h-80 md:h-[500px] overflow-hidden mb-12 bg-byl-dark">
        <img src={event.imageUrl} alt={event.title} className="w-full h-full object-cover opacity-90" />
        <div className="absolute inset-0 bg-gradient-to-t from-byl-dark/60 to-transparent" />
        <div className="absolute bottom-0 left-0 right-0 p-10">
          <span className="px-4 py-1.5 bg-byl-purple text-white text-[9px] font-black uppercase tracking-widest">{event.category}</span>
        </div>
      </div>

      <div className="flex flex-col lg:flex-row gap-12">
        <div className="flex-grow">
          <h1 className="font-serif text-4xl md:text-5xl font-black mb-6 text-byl-dark">{event.title}</h1>
          <p className="text-byl-dark/70 text-lg font-medium leading-relaxed mb-8 italic">"{event.description}"</p>

          <div className="flex flex-col md:flex-row gap-6 mb-10 p-6 bg-byl-dark/5 border border-byl-dark/10">
            <div className="flex items-center text-[11px] uppercase tracking-widest font-bold text-byl-dark/60"><Calendar size={16} className="mr-3 text-byl-purple" />{event.date}</div>
            <div className="flex items-center text-[11px] uppercase tracking-widest font-bold text-byl-dark/60"><Clock size={16} className="mr-3 text-byl-purple" />{event.time}</div>
            <div className="flex items-center text-[11px] uppercase tracking-widest font-bold text-byl-dark/60"><MapPin size={16} className="mr-3 text-byl-purple" />{event.location}</div>
          </div>

          {stats && (
            <div className="flex items-center gap-2 text-sm text-byl-dark/50 mb-8">
              <Users size={16} /><span>{stats.attendeeCount} attending</span>
            </div>
          )}
        </div>

        <div className="lg:w-80 shrink-0">
          <div className="bg-byl-light border border-byl-dark/10 p-8 shadow-xl sticky top-32">
            <h3 className="text-[10px] uppercase tracking-widest font-black text-byl-dark mb-6">Reserve Your Spot</h3>
            {isAuthenticated ? (
              <div className="space-y-4">
                {isRegistered && (
                  <div className="flex items-center gap-2 text-green-600 text-sm font-bold mb-4"><CheckCircle size={16} />You're registered!</div>
                )}
                <button onClick={handleRegister} disabled={registering} className="w-full bg-byl-dark text-byl-light py-5 text-[11px] uppercase tracking-widest font-bold hover:bg-byl-purple disabled:opacity-50 flex items-center justify-center gap-2">
                  {registering ? 'Processing…' : isRegistered ? 'Cancel Registration' : 'Reserve Placement'}
                </button>
                {isRegistered && registration && (
                  <div className="text-center">
                    <p className="text-[10px] uppercase tracking-widest font-bold text-byl-dark/40">Ticket Ref</p>
                    <p className="font-mono text-sm font-bold text-byl-purple">{registration.ticketRef}</p>
                  </div>
                )}
              </div>
            ) : (
              <Link to="/login" className="block text-center bg-byl-dark text-byl-light py-5 text-[11px] uppercase tracking-widest font-bold hover:bg-byl-purple">Sign In to Register</Link>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}