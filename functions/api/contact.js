/**
 * Cloudflare Pages Function — POST /api/contact
 *
 * Cloudflare auto-detects this file because it lives under /functions.
 * It reads the contact form's fields, then sends an email through
 * MailChannels, which is free for any site hosted on Cloudflare and
 * needs no separate account or API key.
 *
 * ---------------------------------------------------------------
 * BEFORE THIS WORKS, edit the two constants right below:
 * ---------------------------------------------------------------
 */
const TO_EMAIL = "your-inbox@example.com";      // where messages should land
const FROM_EMAIL = "contact-form@example.com";  // must be on a domain you control (see README)

export async function onRequestPost({ request }) {
  try {
    const form = await request.formData();

    const firstName = (form.get("fname") || "").toString().trim();
    const lastName = (form.get("lname") || "").toString().trim();
    const email = (form.get("email") || "").toString().trim();
    const comment = (form.get("comment") || "").toString().trim();

    if (!firstName || !lastName || !email || !comment) {
      return json({ ok: false, error: "Please fill in every field." }, 400);
    }

    const payload = {
      personalizations: [{ to: [{ email: TO_EMAIL, name: "T-10 Robotics" }] }],
      from: { email: FROM_EMAIL, name: "T-10 Robotics website" },
      reply_to: { email, name: `${firstName} ${lastName}` },
      subject: `Website contact form — ${firstName} ${lastName}`,
      content: [
        {
          type: "text/plain",
          value: `Name: ${firstName} ${lastName}\nEmail: ${email}\n\n${comment}`,
        },
      ],
    };

    const mcRes = await fetch("https://api.mailchannels.net/tx/v1/send", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    if (!mcRes.ok) {
      const detail = await mcRes.text();
      console.error("MailChannels error:", mcRes.status, detail);
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
