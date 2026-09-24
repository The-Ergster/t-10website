
/*
  Cloudflare Worker handler for the website contact form.

  It reads the form fields, validates them, and sends the message through Resend.
  Configure RESEND_API_KEY, CONTACT_TO_EMAIL, and CONTACT_FROM_EMAIL in Cloudflare.
*/

import { Resend } from "resend";

export async function onRequestPost({ request, env }) {
  try {
    const form = await request.formData();

    const firstName = (form.get("fname") || "").toString().trim();
    const lastName = (form.get("lname") || "").toString().trim();
    const email = (form.get("email") || "").toString().trim();
    const comment = (form.get("comment") || "").toString().trim();
    const website = (form.get("website") || "").toString().trim();

    if (website) {
      return json({ ok: true });
    }

    if (!firstName || !lastName || !email || !comment) {
      return json({ ok: false, error: "Please fill in every field." }, 400);
    }

    if (!isEmail(email)) {
      return json({ ok: false, error: "Please enter a valid email address." }, 400);
    }

    if (firstName.length > 80 || lastName.length > 80 || email.length > 254 || comment.length > 5000) {
      return json({ ok: false, error: "One or more fields are too long." }, 400);
    }

    const config = env || {};
    const apiKey = config.RESEND_API_KEY;
    const toEmail = config.CONTACT_TO_EMAIL;
    const fromEmail = config.CONTACT_FROM_EMAIL;
    if (!apiKey || !toEmail || !fromEmail) {
      console.error("Contact form email configuration is missing.");
      return json({ ok: false, error: "The contact form is not configured yet." }, 503);
    }

    const resend = new Resend(apiKey);
    const { error } = await resend.emails.send({
      from: `T-10 Robotics website <${fromEmail}>`,
      to: [toEmail],
      replyTo: email,
      subject: `Website contact form — ${firstName} ${lastName}`,
      html: `<p><strong>Name:</strong> ${escapeHtml(firstName)} ${escapeHtml(lastName)}</p><p><strong>Email:</strong> ${escapeHtml(email)}</p><p>${escapeHtml(comment).replace(/\n/g, "<br>")}</p>`,
    });

    if (error) {
      console.error("Resend error:", error);
      return json({ ok: false, error: "The message could not be sent." }, 502);
    }

    return json({ ok: true });
  } catch (err) {
    console.error("Contact form error:", err);
    return json({ ok: false, error: "Something went wrong on the server." }, 500);
  }
}

function json(body, status = 200) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { "Content-Type": "application/json" },
  });
}

function isEmail(value) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
}

function escapeHtml(value) {
  return value.replace(/[&<>'"]/g, (character) => ({
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    "'": "&#39;",
    '"': "&quot;",
  })[character]);
}
