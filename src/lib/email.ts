import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: Number(process.env.SMTP_PORT),
    secure: process.env.SMTP_PORT === '465',
    auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
    },
});

const LOGO_URL = 'https://i.ibb.co/jPh9gmpG/optimrental-logo.png';

const getEmailTemplate = (title: string, content: string, details: any) => `
<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <style>
        .body { font-family: 'Inter', -apple-system, sans-serif; background-color: #f8fafc; color: #1e293b; padding: 40px 20px; margin: 0; }
        .container { max-width: 600px; margin: 0 auto; background: #ffffff; border-radius: 24px; overflow: hidden; box-shadow: 0 10px 15px -3px rgba(0,0,0,0.1); }
        .header { background: #0f172a; padding: 40px; text-align: center; }
        .logo { height: 60px; width: auto; }
        .content { padding: 40px; }
        .badge { display: inline-block; background: #fef3c7; color: #b45309; padding: 6px 12px; border-radius: 99px; font-size: 10px; font-weight: 800; text-transform: uppercase; letter-spacing: 0.1em; margin-bottom: 20px; }
        .title { font-size: 28px; font-weight: 900; color: #0f172a; margin: 0 0 20px 0; text-transform: uppercase; letter-spacing: -0.02em; }
        .text { font-size: 16px; line-height: 1.6; color: #475569; margin: 0 0 30px 0; }
        .card { background: #f1f5f9; border-radius: 16px; padding: 24px; margin-bottom: 30px; }
        .row { display: flex; justify-content: space-between; padding: 12px 0; border-bottom: 1px solid #e2e8f0; }
        .row:last-child { border: none; padding-bottom: 0; }
        .label { font-size: 11px; font-weight: 700; color: #94a3b8; text-transform: uppercase; letter-spacing: 0.05em; }
        .value { font-size: 14px; font-weight: 700; color: #0f172a; }
        .total-row { display: flex; justify-content: space-between; padding-top: 20px; margin-top: 20px; border-top: 2px solid #e2e8f0; }
        .total-label { font-size: 14px; font-weight: 900; color: #0f172a; text-transform: uppercase; }
        .total-value { font-size: 24px; font-weight: 900; color: #f59e0b; }
        .footer { padding: 40px; text-align: center; border-top: 1px solid #f1f5f9; }
        .footer-text { font-size: 12px; color: #94a3b8; line-height: 1.5; }
        .link { color: #f59e0b; text-decoration: none; font-weight: 700; }
    </style>
</head>
<body class="body">
    <div class="container">
        <div class="header">
            <img src="${LOGO_URL}" alt="Optimrental" class="logo">
        </div>
        <div class="content">
            <div class="badge">Swiss Premium Fleet</div>
            <h1 class="title">${title}</h1>
            <p class="text">${content}</p>
            
            <div class="card">
                <div class="row">
                    <span class="label">Vehicle</span>
                    <span class="value">${details.vehicleName}</span>
                </div>
                <div class="row">
                    <span class="label">Date</span>
                    <span class="value">${details.date}</span>
                </div>
                <div class="row">
                    <span class="label">Duration</span>
                    <span class="value">${details.hours} Hours</span>
                </div>
                <div class="total-row">
                    <span class="total-label">Grand Total</span>
                    <span class="total-value">${details.totalPrice} CHF</span>
                </div>
            </div>
            
            <p class="text" style="margin-bottom: 0;">Our team is preparing your vehicle for an exceptional experience. If you have any questions, feel free to reply to this email.</p>
        </div>
        <div class="footer">
            <p class="footer-text">
                © ${new Date().getFullYear()} Optimrental Switzerland. All rights reserved.<br>
                Zürich • Basel • Geneva • Bern • Lugano • St. Moritz<br>
                <a href="https://optimrental.ch" class="link">optimrental.ch</a> | <a href="https://www.habb.uk" class="link">Developed by HABB</a>
            </p>
        </div>
    </div>
</body>
</html>
`;

export async function sendBookingConfirmation(email: string, bookingDetails: any) {
    const title = "Booking Received";
    const content = `Thank you for choosing Optimrental. We have received your booking request for the <strong>${bookingDetails.vehicleName}</strong>. Our team is currently reviewing the availability and will confirm your trip shortly.`;

    const mailOptions = {
        from: process.env.SMTP_FROM,
        to: email,
        subject: `Booking Request Received - ${bookingDetails.vehicleName}`,
        html: getEmailTemplate(title, content, bookingDetails),
    };

    return transporter.sendMail(mailOptions);
}

export async function sendAdminConfirmation(email: string, bookingDetails: any) {
    const title = "Booking Confirmed";
    const content = `Your booking with Optimrental has been <strong>officially confirmed</strong>! We are excited to serve you. Please find your final trip details and pricing below.`;

    const mailOptions = {
        from: process.env.SMTP_FROM,
        to: email,
        subject: `Booking Confirmed: ${bookingDetails.vehicleName} - Optimrental`,
        html: getEmailTemplate(title, content, bookingDetails),
    };

    return transporter.sendMail(mailOptions);
}
