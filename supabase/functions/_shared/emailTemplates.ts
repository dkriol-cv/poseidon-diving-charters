import { getLanguageText } from './templateRenderer.ts';

const BRAND_COLORS = {
  primary: '#03c4c9',   // Poseidon Cyan
  secondary: '#1a2b3c', // Deep Navy
  bg: '#f8fafb',
  white: '#ffffff',
  text: '#2d353b',
  border: '#e2e8f0'
};

const BASE_STYLES = `
  body { font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; line-height: 1.6; color: ${BRAND_COLORS.text}; background-color: ${BRAND_COLORS.bg}; margin: 0; padding: 0; -webkit-font-smoothing: antialiased; }
  .wrapper { width: 100%; background-color: ${BRAND_COLORS.bg}; padding: 40px 0; }
  .container { max-width: 600px; margin: 0 auto; background-color: ${BRAND_COLORS.white}; border-radius: 16px; overflow: hidden; box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06); }
  .header { background-color: ${BRAND_COLORS.secondary}; padding: 32px 40px; text-align: center; }
  .header h1 { color: ${BRAND_COLORS.white}; margin: 0; font-size: 24px; font-weight: 700; letter-spacing: 0.5px; text-transform: uppercase; }
  .content { padding: 40px; }
  .welcome-text { font-size: 16px; color: ${BRAND_COLORS.text}; margin-bottom: 24px; }
  .info-box { background-color: #f8fafc; border: 1px solid ${BRAND_COLORS.border}; border-radius: 12px; padding: 24px; margin-bottom: 32px; }
  .info-row { display: flex; justify-content: space-between; padding: 12px 0; border-bottom: 1px solid ${BRAND_COLORS.border}; }
  .info-row:last-child { border-bottom: none; }
  .label { font-size: 12px; text-transform: uppercase; letter-spacing: 1px; color: #64748b; font-weight: 600; }
  .value { font-size: 14px; color: ${BRAND_COLORS.secondary}; font-weight: 600; text-align: right; }
  .total-row { display: flex; justify-content: space-between; padding-top: 16px; margin-top: 16px; border-top: 2px solid ${BRAND_COLORS.border}; }
  .total-label { font-size: 16px; font-weight: 700; color: ${BRAND_COLORS.secondary}; }
  .total-value { font-size: 20px; font-weight: 800; color: ${BRAND_COLORS.primary}; }
  .button-container { text-align: center; margin-top: 32px; margin-bottom: 10px; }
  .cta-button { display: inline-block; background-color: ${BRAND_COLORS.primary}; color: ${BRAND_COLORS.white}; text-decoration: none; padding: 16px 32px; border-radius: 8px; font-weight: 700; font-size: 14px; text-transform: uppercase; letter-spacing: 1px; transition: background-color 0.2s; }
  .footer { background-color: #f1f5f9; padding: 32px 40px; text-align: center; border-top: 1px solid ${BRAND_COLORS.border}; }
  .footer p { margin: 0 0 8px; font-size: 12px; color: #64748b; }
  .footer-link { color: ${BRAND_COLORS.primary}; text-decoration: none; font-weight: 600; }
  .section-title { font-size: 12px; font-weight: 700; color: ${BRAND_COLORS.primary}; text-transform: uppercase; margin-top: 24px; margin-bottom: 12px; letter-spacing: 0.5px; }
  .extras-list { margin: 0; padding: 0; list-style: none; }
  .extra-item { font-size: 14px; color: ${BRAND_COLORS.text}; padding: 8px 0; border-bottom: 1px dashed ${BRAND_COLORS.border}; display: flex; justify-content: space-between; }
  .extra-item:last-child { border-bottom: none; }
`;

export const getBookingConfirmationEmail = (booking: any) => {
  // Format currency
  const formattedPrice = new Intl.NumberFormat('pt-PT', { style: 'currency', currency: 'EUR' }).format(booking.total_price);
  
  // Format Date safely
  let formattedDate = booking.booking_date;
  try {
    formattedDate = new Date(booking.booking_date).toLocaleDateString('en-GB', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });
  } catch (e) {
    console.error("Date formatting error", e);
  }

  const shortRef = booking.booking_id ? booking.booking_id.substring(0, 8).toUpperCase() : (booking.id ? booking.id.substring(0, 8).toUpperCase() : 'PENDING');
  
  // Base URL for the link
  const baseUrl = 'https://poseidondivingcharters.com'; 
  const confirmationLink = `${baseUrl}/booking-confirmation/${booking.booking_id || booking.id}`;

  // Build Extras HTML
  let extrasHtml = '';
  if (booking.detailed_extras && booking.detailed_extras.length > 0) {
    extrasHtml = `
      <div class="section-title">Selected Extras</div>
      <ul class="extras-list">
        ${booking.detailed_extras.map((extra: any) => `
          <li class="extra-item">
            <span>${extra.name}</span>
            <strong>${new Intl.NumberFormat('pt-PT', { style: 'currency', currency: 'EUR' }).format(extra.price)}</strong>
          </li>
        `).join('')}
      </ul>
    `;
  } else if (booking.extras && booking.extras.length > 0) {
    // Fallback if only IDs provided
    extrasHtml = `
      <div class="section-title">Extras</div>
      <p style="font-size: 13px; color: #64748b;">${booking.extras.length} extra(s) selected (IDs: ${booking.extras.join(', ')})</p>
    `;
  }

  // Handle Special Requests HTML - properly handles empty/null values by displaying "None"
  const specialRequestsText = (booking.special_requests || booking.specialRequests || '').trim();
  const displaySpecialRequests = specialRequestsText.length > 0 ? specialRequestsText : 'None';
  
  const requestsHtml = `
    <div class="section-title">Special Requests</div>
    <p style="font-size: 14px; font-style: ${specialRequestsText ? 'italic' : 'normal'}; background-color: ${specialRequestsText ? '#fef9c3' : '#f8fafc'}; padding: 12px; border-radius: 6px; color: ${specialRequestsText ? '#854d0e' : '#64748b'}; margin: 0; border: 1px solid ${specialRequestsText ? '#fde047' : BRAND_COLORS.border};">
      ${displaySpecialRequests !== 'None' ? `"${displaySpecialRequests}"` : displaySpecialRequests}
    </p>
  `;

  return `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <style>${BASE_STYLES}</style>
    </head>
    <body>
      <div class="wrapper">
        <div class="container">
          <div class="header">
            <h1>Booking Details</h1>
          </div>
          
          <div class="content">
            <p class="welcome-text">
              Dear <strong>${booking.customer_name}</strong>,
            </p>
            <p class="welcome-text">
              We have received your booking request for <strong>Poseidon Diving Charters</strong>. Below are the details of your scheduled adventure.
            </p>

            <div class="info-box">
              <div class="info-row">
                <span class="label">Reference</span>
                <span class="value">#${shortRef}</span>
              </div>
              <div class="info-row">
                <span class="label">Service</span>
                <span class="value">${booking.service_type?.replace(/-/g, ' ')}</span>
              </div>
              <div class="info-row">
                <span class="label">Option</span>
                <span class="value">${booking.service_option?.replace(/_/g, ' ')}</span>
              </div>
              <div class="info-row">
                <span class="label">Date</span>
                <span class="value">${formattedDate}</span>
              </div>
              <div class="info-row">
                <span class="label">Departure</span>
                <span class="value">${booking.departure_time ? booking.departure_time.substring(0, 5) + 'h' : 'TBA'}</span>
              </div>
              <div class="info-row">
                <span class="label">Guests</span>
                <span class="value">${booking.num_guests} Person(s)</span>
              </div>
              
              <div class="info-row">
                <span class="label">Phone</span>
                <span class="value">${booking.customer_phone || 'N/A'}</span>
              </div>

              ${extrasHtml}
              ${requestsHtml}
              
              <div class="total-row">
                <span class="total-label">TOTAL ESTIMATED</span>
                <span class="total-value">${formattedPrice}</span>
              </div>
            </div>

            <div class="button-container">
              <a href="${confirmationLink}" class="cta-button" target="_blank">View Status</a>
            </div>
            
            <p style="text-align: center; font-size: 12px; color: #94a3b8; margin-top: 20px;">
              Please arrive 30 minutes before your scheduled departure time at Vilamoura Marina.
            </p>
          </div>

          <div class="footer">
            <p><strong>Poseidon Diving Charters</strong></p>
            <p>Vilamoura Marina, Algarve, Portugal</p>
            <p><a href="mailto:info@poseidondivingcharters.com" class="footer-link">info@poseidondivingcharters.com</a></p>
            <p style="margin-top: 16px;">&copy; ${new Date().getFullYear()} MLVDM - Green Calm Sea Lda. All rights reserved.</p>
          </div>
        </div>
      </div>
    </body>
    </html>
  `;
};