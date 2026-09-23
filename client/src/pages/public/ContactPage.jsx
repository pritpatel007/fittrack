import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { contactAPI } from '../../services/api';
import { Mail, Phone, MapPin, Send, CheckCircle } from 'lucide-react';
import toast from 'react-hot-toast';

export default function ContactPage() {
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const { register, handleSubmit, formState: { errors }, reset } = useForm();

  const onSubmit = async (data) => {
    setLoading(true);
    try {
      await contactAPI.submit(data);
      setSubmitted(true);
      reset();
      toast.success('Message sent!');
    } catch {
      toast.error('Failed to send message. Try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen pt-24 pb-20 px-4">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-14">
          <p className="text-brand-400 font-medium text-sm uppercase tracking-widest mb-3">Get in Touch</p>
          <h1 className="section-title mb-4">Contact Us</h1>
          <p className="text-gray-400 max-w-md mx-auto">Have a question or want to visit? We'd love to hear from you.</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 max-w-5xl mx-auto">
          {/* Info */}
          <div className="space-y-6">
            <div className="card p-6">
              <h3 className="font-semibold text-white mb-5">Contact Information</h3>
              <div className="space-y-4">
                {[
                  { icon: MapPin, label: 'Address',  value: '123 Fitness Blvd, Sport City, SC 10001' },
                  { icon: Phone,  label: 'Phone',    value: '+1 (555) 123-4567' },
                  { icon: Mail,   label: 'Email',    value: 'hello@fittrack.com' },
                ].map(({ icon: Icon, label, value }) => (
                  <div key={label} className="flex items-start gap-3">
                    <div className="w-9 h-9 bg-brand-500/10 rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5">
                      <Icon size={16} className="text-brand-400" />
                    </div>
                    <div>
                      <p className="text-gray-500 text-xs">{label}</p>
                      <p className="text-gray-200 text-sm font-medium">{value}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="card p-6">
              <h3 className="font-semibold text-white mb-3">Hours</h3>
              <div className="space-y-2 text-sm">
                {[['Monday – Friday', '5:00 AM – 11:00 PM'], ['Saturday', '6:00 AM – 10:00 PM'], ['Sunday', '7:00 AM – 8:00 PM']].map(([day, hours]) => (
                  <div key={day} className="flex justify-between text-gray-400">
                    <span>{day}</span>
                    <span className="text-gray-200">{hours}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Form */}
          <div className="card p-7">
            {submitted ? (
              <div className="flex flex-col items-center justify-center h-full py-10 text-center">
                <CheckCircle size={48} className="text-emerald-400 mb-4" />
                <h3 className="font-display text-xl font-bold text-white mb-2">Message Sent!</h3>
                <p className="text-gray-400 text-sm">We'll get back to you within 24 hours.</p>
                <button onClick={() => setSubmitted(false)} className="btn-secondary mt-6 text-sm">Send another</button>
              </div>
            ) : (
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="label">Your Name</label>
                    <input className={`input ${errors.name ? 'border-red-500' : ''}`} placeholder="Jane Smith"
                      {...register('name', { required: true })} />
                  </div>
                  <div>
                    <label className="label">Email</label>
                    <input type="email" className={`input ${errors.email ? 'border-red-500' : ''}`} placeholder="jane@email.com"
                      {...register('email', { required: true })} />
                  </div>
                </div>
                <div>
                  <label className="label">Subject</label>
                  <input className="input" placeholder="Membership inquiry" {...register('subject')} />
                </div>
                <div>
                  <label className="label">Message</label>
                  <textarea className={`input resize-none ${errors.message ? 'border-red-500' : ''}`}
                    rows={5} placeholder="Tell us how we can help…"
                    {...register('message', { required: true })} />
                </div>
                <button type="submit" disabled={loading} className="btn-primary w-full py-3 gap-2">
                  <Send size={16} /> {loading ? 'Sending…' : 'Send Message'}
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
