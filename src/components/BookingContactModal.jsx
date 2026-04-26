
import React from 'react';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { MessageCircle, Phone, Mail, X } from 'lucide-react';
import { useBookingModal } from '@/contexts/BookingModalContext';

const BookingContactModal = () => {
  const { isOpen, closeModal, experienceName, experienceImage } = useBookingModal();

  const experienceImages = {
    'Tailor-made diving charter': 'https://hcypqomjisyqrczwjrgc.supabase.co/storage/v1/object/public/Experiences%20-%20Photos/Tailor-made%20Diving%20Charter%20-%20Thumbnail%20-%20Photo.jpeg',
    'Pre-designed diving charter': 'https://hcypqomjisyqrczwjrgc.supabase.co/storage/v1/object/public/Experiences%20-%20Photos/Pre-design%20diving%20charter-thumbnail%20photo.jpeg',
    'Pre-designed diving charter - ¾ Day': 'https://hcypqomjisyqrczwjrgc.supabase.co/storage/v1/object/public/Experiences%20-%20Photos/Pre-design%20diving%20charter-thumbnail%20photo.jpeg',
    'Pre-designed diving charter - Full Day': 'https://hcypqomjisyqrczwjrgc.supabase.co/storage/v1/object/public/Experiences%20-%20Photos/Pre-design%20diving%20charter-thumbnail%20photo.jpeg',
    'Pre-designed Diving Charter - General Inquiry': 'https://hcypqomjisyqrczwjrgc.supabase.co/storage/v1/object/public/Experiences%20-%20Photos/Pre-design%20diving%20charter-thumbnail%20photo.jpeg',
    'Private Boat Charter': 'https://hcypqomjisyqrczwjrgc.supabase.co/storage/v1/object/public/Experiences%20-%20Photos/Private%20Boat%20Charter%20-%20Thumbnail%20-%20Photo.jpeg',
    'Private Boat Charter - Sunset Boat Charter': 'https://hcypqomjisyqrczwjrgc.supabase.co/storage/v1/object/public/Experiences%20-%20Photos/Private%20Boat%20Charter%20-%20Thumbnail%20-%20Photo.jpeg',
    'Private Boat Charter - Morning Boat Charter': 'https://hcypqomjisyqrczwjrgc.supabase.co/storage/v1/object/public/Experiences%20-%20Photos/Private%20Boat%20Charter%20-%20Thumbnail%20-%20Photo.jpeg',
    'Private Boat Charter - Afternoon Boat Charter': 'https://hcypqomjisyqrczwjrgc.supabase.co/storage/v1/object/public/Experiences%20-%20Photos/Private%20Boat%20Charter%20-%20Thumbnail%20-%20Photo.jpeg',
    'Private Boat Charter - ¾ Day Boat Charter': 'https://hcypqomjisyqrczwjrgc.supabase.co/storage/v1/object/public/Experiences%20-%20Photos/Private%20Boat%20Charter%20-%20Thumbnail%20-%20Photo.jpeg',
    'Private Boat Charter - General Inquiry': 'https://hcypqomjisyqrczwjrgc.supabase.co/storage/v1/object/public/Experiences%20-%20Photos/Private%20Boat%20Charter%20-%20Thumbnail%20-%20Photo.jpeg',
    'Beach Charter': 'https://hcypqomjisyqrczwjrgc.supabase.co/storage/v1/object/public/Experiences%20-%20Photos/Private%20Boat%20Charter%20-%20Thumbnail%20-%20Photo.jpeg',
    'General Experience Inquiry': 'https://images.unsplash.com/photo-1593351415075-3bac9f45c877?q=80&w=1171&auto=format&fit=crop'
  };

  const displayImage = experienceImage || experienceImages[experienceName] || '';

  const generateWhatsAppMessage = (experienceName) => {
    // Optimized message format with clear structure and proper line breaks
    return `Hello Poseidon Diving Charters!

I would like to book: ${experienceName}

My details:
- Preferred date: 
- Number of guests: 
- Diving certification/experience: 
- Special requests: 

Thank you!`;
  };

  const generateEmailSubject = (experienceName) => {
    return `Booking Request: ${experienceName}`;
  };

  const generateEmailBody = (experienceName) => {
    // Email-friendly format with proper spacing
    return `Hello Poseidon Diving Charters,

I would like to book: ${experienceName}

My details:
- Preferred date: 
- Number of guests: 
- Diving certification/experience level: 
- Special requests or questions: 

Looking forward to your response.

Best regards`;
  };

  const whatsappLink = `https://wa.me/351924955333?text=${encodeURIComponent(generateWhatsAppMessage(experienceName))}`;
  const emailLink = `mailto:info@poseidondivingcharters.com?subject=${encodeURIComponent(generateEmailSubject(experienceName))}&body=${encodeURIComponent(generateEmailBody(experienceName))}`;
  const phoneLink = `tel:+351924955333`;

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && closeModal()}>
      <DialogContent className="sm:max-w-[560px] p-0 overflow-hidden gap-0 max-h-[90vh] overflow-y-auto">
        <button
          onClick={closeModal}
          className="absolute right-4 top-4 rounded-sm opacity-90 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none z-50 bg-black/50 hover:bg-black/70 p-2.5 backdrop-blur-sm"
          aria-label="Close booking modal"
        >
          <X className="h-4 w-4 text-white" />
          <span className="sr-only">Close</span>
        </button>

        {/* Dynamic Image Section with Experience Name */}
        <div className="relative h-[200px] sm:h-[240px] w-full overflow-hidden rounded-t-lg">
          {displayImage ? (
            <>
              <img 
                src={displayImage} 
                alt={experienceName}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-b from-transparent via-black/40 to-black/70"></div>
            </>
          ) : (
            <div className="w-full h-full bg-gradient-to-br from-[#03c4c9] to-[#1a2332]"></div>
          )}
          
          <div className="absolute bottom-0 left-0 right-0 p-6">
            <h2 className="text-white font-bold text-xl sm:text-2xl leading-tight drop-shadow-lg">
              {experienceName}
            </h2>
          </div>
        </div>

        {/* Content Section */}
        <div className="px-6 sm:px-8 py-8">
          <div className="mb-8">
            <h3 className="text-2xl sm:text-3xl font-bold text-[#2d353b] dark:text-white mb-3">
              Book Your Experience
            </h3>
            <p className="text-base sm:text-lg text-[#8c959f] dark:text-gray-400 leading-relaxed">
              Contact us directly to check availability and confirm your booking. We respond within 24 hours.
            </p>
          </div>

          <div className="flex flex-col gap-4 mb-8">
            <a
              href={whatsappLink}
              target="_blank"
              rel="noopener noreferrer"
              onClick={closeModal}
              aria-label="Book via WhatsApp"
            >
              <Button className="w-full h-14 sm:h-16 bg-[#25D366] hover:bg-[#128C7E] text-white border-none shadow-md hover:shadow-lg transition-all text-base sm:text-lg font-bold">
                <MessageCircle size={22} className="mr-3" />
                <span>Book via WhatsApp</span>
              </Button>
            </a>

            <a
              href={phoneLink}
              onClick={closeModal}
              aria-label="Call to book"
            >
              <Button className="w-full h-14 sm:h-16 bg-[#03c4c9] hover:bg-[#02a8ad] text-white border-none shadow-md hover:shadow-lg transition-all text-base sm:text-lg font-bold">
                <Phone size={22} className="mr-3" />
                <span>Call to Book</span>
              </Button>
            </a>

            <a
              href={emailLink}
              onClick={closeModal}
              aria-label="Book by email"
            >
              <Button className="w-full h-14 sm:h-16 bg-white hover:bg-gray-50 text-[#2d353b] border-2 border-gray-200 hover:border-[#03c4c9] shadow-md hover:shadow-lg transition-all text-base sm:text-lg font-bold">
                <Mail size={22} className="mr-3" />
                <span>Book by Email</span>
              </Button>
            </a>
          </div>

          <div className="pt-6 border-t border-gray-200 dark:border-gray-800">
            <div className="bg-blue-50 dark:bg-blue-900/10 p-4 rounded-lg border-l-4 border-[#03c4c9]">
              <p className="text-xs sm:text-sm text-[#8c959f] dark:text-gray-400 leading-relaxed">
                <span className="font-bold text-[#2d353b] dark:text-white">Quick Response Guarantee:</span> Our team will respond within 24 hours to confirm availability, answer questions, and finalize your booking details.
              </p>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default BookingContactModal;
