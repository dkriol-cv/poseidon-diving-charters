import { getLanguageText } from './templateRenderer.ts';

export const getBookingConfirmationSMS = (vars: any, lang: string = 'en') => {
  return getLanguageText(
    `Poseidon: Confirmed! ${vars.service_name} on ${vars.booking_date} @ ${vars.departure_time}. Full payment received. Your booking is confirmed!`,
    `Poseidon: Confirmado! ${vars.service_name} em ${vars.booking_date} às ${vars.departure_time}. Pagamento integral recebido. A sua reserva está confirmada!`,
    lang
  );
};

export const getReminderSMS = (vars: any, lang: string = 'en') => {
  return getLanguageText(
    `Poseidon Reminder: Your trip is tomorrow at ${vars.departure_time}. Please arrive 30 mins early.`,
    `Lembrete Poseidon: Sua viagem é amanhã às ${vars.departure_time}. Chegue 30 min antes.`,
    lang
  );
};

export const getCancellationSMS = (vars: any, lang: string = 'en') => {
  return getLanguageText(
    `Poseidon: Your booking for ${vars.booking_date} has been CANCELLED. Check email for details.`,
    `Poseidon: A sua reserva para ${vars.booking_date} foi CANCELADA. Verifique o email para detalhes.`,
    lang
  );
};

export const getAdminAlertSMS = (vars: any) => {
  return `NEW BOOKING: ${vars.customer_name} - ${vars.service_name} on ${vars.booking_date}. Fully Paid: €${vars.total_price}`;
};