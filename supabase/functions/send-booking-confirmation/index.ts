import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { corsHeaders } from "../_shared/cors.ts"
import { getBookingConfirmationEmail } from "../_shared/emailTemplates.ts"

const RESEND_API_KEY = Deno.env.get('RESEND_API_KEY')
const ADMIN_EMAIL = 'info@poseidondivingcharters.com'

serve(async (req) => {
  // 1. Handle CORS Preflight
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    // 2. Validate API Key Availability
    if (!RESEND_API_KEY) {
      console.error('RESEND_API_KEY is not set')
      throw new Error('Server configuration error: Missing API Key')
    }

    // 3. Parse Request Body
    // Expecting { booking: { ... } } structure
    const body = await req.json()
    const booking = body.booking || body // Flexible handling if 'booking' wrapper is missing

    // 4. Validate Required Fields
    const requiredFields = ['customer_name', 'customer_email', 'booking_date', 'total_price', 'booking_id'] 
    // Note: booking_id is used in template. Check for 'id' as fallback
    
    const missingFields = requiredFields.filter(field => {
      // Check for field, or fallback 'id' if 'booking_id' is missing
      if (field === 'booking_id' && booking.id) return false;
      return !booking?.[field];
    })
    
    if (missingFields.length > 0) {
      const errorMsg = `Missing required booking fields: ${missingFields.join(', ')}`
      console.error(errorMsg)
      return new Response(
        JSON.stringify({ error: errorMsg }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    // Normalize ID for template
    if (!booking.booking_id && booking.id) {
        booking.booking_id = booking.id;
    }

    console.log(`Generating email for booking ID: ${booking.booking_id}`)
    
    // Log additional fields for verification
    console.log('Customer Phone:', booking.customer_phone)
    console.log('Special Requests:', booking.special_requests)
    console.log('Extras Count:', booking.extras?.length)

    // 5. Generate Email HTML
    // Now passing the full booking object which includes detailed_extras, special_requests, etc.
    const emailHtml = getBookingConfirmationEmail(booking)

    // 6. Send Email via Resend
    const res = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${RESEND_API_KEY}`,
      },
      body: JSON.stringify({
        from: 'Poseidon Diving <noreply@poseidondivingcharters.com>',
        to: [booking.customer_email, ADMIN_EMAIL],
        subject: `Booking Request - Reference #${booking.booking_id.substring(0, 8).toUpperCase()}`,
        html: emailHtml,
        tags: [
          { name: 'category', value: 'booking_confirmation' },
          { name: 'booking_id', value: booking.booking_id }
        ]
      }),
    })

    const data = await res.json()

    if (!res.ok) {
      console.error('Resend API Error:', data)
      throw new Error(`Email provider error: ${JSON.stringify(data)}`)
    }

    console.log('Email sent successfully:', data)

    // 7. Success Response
    return new Response(
      JSON.stringify({ success: true, message: 'Confirmation email sent', data }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )

  } catch (error) {
    console.error('Function error:', error)
    
    return new Response(
      JSON.stringify({ error: error.message || 'Internal Server Error' }),
      { 
        status: 500, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    )
  }
})