import React, { useState } from 'react';
import { Helmet } from 'react-helmet';
import Breadcrumbs from '@/components/Breadcrumbs';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/components/ui/use-toast';
import { Mail, Phone, MapPin, Clock, Loader2 } from 'lucide-react';
import { supabase } from '@/lib/customSupabaseClient';
import { validateEmail, validatePhone, sanitizeText } from '@/lib/validation';
const ContactPage = () => {
  const {
    toast
  } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    message: '',
    subject: '',
    website_url: '' // Honeypot
  });
  const [errors, setErrors] = useState({});
  const fadeInUp = {
    initial: {
      opacity: 0,
      y: 30
    },
    whileInView: {
      opacity: 1,
      y: 0
    },
    viewport: {
      once: true
    },
    transition: {
      duration: 0.6
    }
  };
  const validateForm = () => {
    const newErrors = {};
    let isValid = true;
    if (!formData.name || formData.name.trim().length < 2) {
      newErrors.name = "Please enter your name";
      isValid = false;
    }
    if (!validateEmail(formData.email)) {
      newErrors.email = "Please enter a valid email";
      isValid = false;
    }
    if (formData.phone && !validatePhone(formData.phone)) {
      newErrors.phone = "Invalid phone format";
      isValid = false;
    }
    if (!formData.message || formData.message.trim().length < 10) {
      newErrors.message = "Message must be at least 10 characters";
      isValid = false;
    }
    setErrors(newErrors);
    return isValid;
  };
  const handleSubmit = async e => {
    e.preventDefault();
    setErrors({});
    if (!validateForm()) return;
    setIsSubmitting(true);
    const payload = {
      name: sanitizeText(formData.name),
      email: sanitizeText(formData.email),
      phone: sanitizeText(formData.phone),
      subject: sanitizeText(formData.subject),
      message: sanitizeText(formData.message),
      honeypot: formData.website_url
    };
    try {
      const {
        data,
        error
      } = await supabase.functions.invoke('contact-submit', {
        body: JSON.stringify(payload)
      });
      if (error) throw error;
      if (data && data.success) {
        toast({
          title: "Message Sent Successfully!",
          description: "We'll get back to you as soon as possible.",
          className: "bg-green-500 text-white border-none"
        });
        setFormData({
          name: '',
          email: '',
          phone: '',
          message: '',
          subject: '',
          website_url: ''
        });
      } else {
        throw new Error(data?.message || 'Unknown error');
      }
    } catch (error) {
      console.error("Submission error:", error);
      toast({
        title: "Submission Failed",
        description: "Please check your internet connection and try again.",
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };
  const handleChange = e => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
    if (errors[e.target.name]) setErrors({
      ...errors,
      [e.target.name]: null
    });
  };
  const handleSelectChange = value => {
    setFormData({
      ...formData,
      subject: value
    });
  };
  return <>
      <Helmet>
        <title>Contact | Poseidon Diving Charters</title>
      </Helmet>
      <Breadcrumbs items={[{ name: 'Home', url: '/' }, { name: 'Contact', url: '/contact' }]} />

      <div className="pt-24 bg-white dark:bg-[#0b1216]">
        <section className="relative py-20 px-4 border-b border-gray-100 dark:border-gray-800 bg-[#f5f7f9] dark:bg-[#111a1f]">
          <div className="container mx-auto max-w-4xl text-center">
            <motion.span initial={{
            opacity: 0
          }} animate={{
            opacity: 1
          }} className="text-[#03c4c9] font-bold tracking-widest uppercase text-sm mb-4 block">
              Support & Inquiries
            </motion.span>
            <motion.h1 initial={{
            opacity: 0,
            y: 30
          }} animate={{
            opacity: 1,
            y: 0
          }} className="text-4xl sm:text-5xl md:text-6xl font-bold mb-6 leading-tight dark:text-white">
              CONTACT
            </motion.h1>
          </div>
        </section>

        <section className="py-20 px-4">
          <div className="container mx-auto max-w-6xl">
            <div className="grid lg:grid-cols-2 gap-16">
              <motion.div {...fadeInUp}>
                <h2 className="text-3xl font-bold mb-8 dark:text-white">Questions or Special Requests?</h2>
                <p className="text-lg text-[#8c959f] dark:text-gray-400 mb-12 leading-relaxed">Bookings are made directly through our online booking system. Use this page if you have questions, special requests, or need help choosing the best charter option. For the fastest response, use the WhatsApp button — or send a message below and we'll reply as soon as possible.</p>

                <div className="space-y-8">
                  {/* Email */}
                  <div className="flex items-start group">
                    <div className="bg-[#f5f7f9] dark:bg-[#162026] p-3 rounded-full mr-6 group-hover:bg-[#03c4c9] transition-colors duration-300">
                      <Mail className="text-[#2d353b] dark:text-white group-hover:text-white transition-colors" size={24} />
                    </div>
                    <div>
                      <span className="font-bold block mb-1 text-sm uppercase tracking-wide dark:text-gray-300">Email</span>
                      <p className="text-[#8c959f] dark:text-gray-400 text-lg">info@poseidondivingcharters.com</p>
                    </div>
                  </div>

                  {/* Phone */}
                  <div className="flex items-start group">
                    <div className="bg-[#f5f7f9] dark:bg-[#162026] p-3 rounded-full mr-6 group-hover:bg-[#03c4c9] transition-colors duration-300">
                      <Phone className="text-[#2d353b] dark:text-white group-hover:text-white transition-colors" size={24} />
                    </div>
                    <div>
                      <span className="font-bold block mb-1 text-sm uppercase tracking-wide dark:text-gray-300">Phone</span>
                      <p className="text-[#8c959f] dark:text-gray-400 text-lg">+351 924 955 333</p>
                    </div>
                  </div>

                  {/* Location */}
                  <div className="flex items-start group">
                    <div className="bg-[#f5f7f9] dark:bg-[#162026] p-3 rounded-full mr-6 group-hover:bg-[#03c4c9] transition-colors duration-300">
                      <MapPin className="text-[#2d353b] dark:text-white group-hover:text-white transition-colors" size={24} />
                    </div>
                    <div>
                      <span className="font-bold block mb-1 text-sm uppercase tracking-wide dark:text-gray-300">Location</span>
                      <p className="text-[#8c959f] dark:text-gray-400 text-lg">Marina de Lagos, Lagos, Portugal</p>
                      <p className="text-[#03c4c9] text-sm mt-1">
                        Meeting point: <span className="text-[#8c959f] dark:text-gray-400">Gate E - F - G - H - I</span>
                      </p>
                    </div>
                  </div>

                  {/* Hours */}
                  <div className="flex items-start group">
                    <div className="bg-[#f5f7f9] dark:bg-[#162026] p-3 rounded-full mr-6 group-hover:bg-[#03c4c9] transition-colors duration-300">
                      <Clock className="text-[#2d353b] dark:text-white group-hover:text-white transition-colors" size={24} />
                    </div>
                    <div>
                      <span className="font-bold block mb-1 text-sm uppercase tracking-wide dark:text-gray-300">Hours</span>
                      <p className="text-[#8c959f] dark:text-gray-400 text-lg">Mon - Sun: 8:00 AM - 8:00 PM</p>
                    </div>
                  </div>
                </div>
              </motion.div>

              <motion.div {...fadeInUp} transition={{
              delay: 0.2
            }}>
                <div className="bg-[#f5f7f9] dark:bg-[#162026] rounded-2xl p-8 md:p-10 shadow-sm border border-gray-100 dark:border-gray-800">
                  <h2 className="text-2xl font-bold mb-8 dark:text-white">Send Your Inquiry</h2>

                  <form onSubmit={handleSubmit} className="space-y-6" noValidate>
                    <input type="hidden" name="website_url" value={formData.website_url} onChange={handleChange} />

                    <div>
                      <Label htmlFor="name" className="mb-2 block text-xs uppercase tracking-wide font-bold dark:text-gray-300">
                        Name *
                      </Label>
                      <Input id="name" name="name" value={formData.name} onChange={handleChange} className={`bg-white dark:bg-[#0b1216] ${errors.name ? 'border-red-500' : ''}`} disabled={isSubmitting} />
                      {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name}</p>}
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <Label htmlFor="email" className="mb-2 block text-xs uppercase tracking-wide font-bold dark:text-gray-300">
                          Email *
                        </Label>
                        <Input id="email" name="email" type="email" value={formData.email} onChange={handleChange} className={`bg-white dark:bg-[#0b1216] ${errors.email ? 'border-red-500' : ''}`} disabled={isSubmitting} />
                        {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email}</p>}
                      </div>

                      <div>
                        <Label htmlFor="phone" className="mb-2 block text-xs uppercase tracking-wide font-bold dark:text-gray-300">
                          Phone (Optional)
                        </Label>
                        <Input id="phone" name="phone" type="tel" value={formData.phone} onChange={handleChange} className={`bg-white dark:bg-[#0b1216] ${errors.phone ? 'border-red-500' : ''}`} disabled={isSubmitting} />
                        {errors.phone && <p className="text-red-500 text-xs mt-1">{errors.phone}</p>}
                      </div>
                    </div>

                    <div>
                      <Label htmlFor="subject" className="mb-2 block text-xs uppercase tracking-wide font-bold dark:text-gray-300">
                        Type of Charter (Subject)
                      </Label>
                      <Select value={formData.subject} onValueChange={handleSelectChange} disabled={isSubmitting}>
                        <SelectTrigger className="bg-white dark:bg-[#0b1216]">
                          <SelectValue placeholder="Select type (Optional)" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Tailor-Made">Tailor-Made Experience</SelectItem>
                          <SelectItem value="Pre-Designed">Pre-Designed Charter</SelectItem>
                          <SelectItem value="Exclusive">Exclusive Boat Charter</SelectItem>
                          <SelectItem value="Inquiry">General Inquiry</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div>
                      <Label htmlFor="message" className="mb-2 block text-xs uppercase tracking-wide font-bold dark:text-gray-300">
                        Message *
                      </Label>
                      <Textarea id="message" name="message" value={formData.message} onChange={handleChange} rows={5} className={`bg-white dark:bg-[#0b1216] ${errors.message ? 'border-red-500' : ''}`} disabled={isSubmitting} />
                      {errors.message && <p className="text-red-500 text-xs mt-1">{errors.message}</p>}
                    </div>

                    <Button type="submit" className="w-full bg-[#03c4c9] hover:bg-[#f5c842] hover:text-[#2d353b] text-white font-bold transition-colors" size="lg" disabled={isSubmitting}>
                      {isSubmitting ? <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Sending...
                        </> : 'SEND MESSAGE'}
                    </Button>
                  </form>
                </div>
              </motion.div>

            </div>
          </div>
        </section>
      </div>
    </>;
};
export default ContactPage;