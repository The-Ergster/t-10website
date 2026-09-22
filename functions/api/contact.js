
/*
  Cloudflare Pages function for the website contact form.

  It reads the form fields, validates them, and sends the message through MailChannels.
  To change the destination email or form behavior, update the constants and validation here.
*/

const TO_EMAIL = "glasserelliot@gmail.com";      
const FROM_EMAIL = "contact-form@example.com";  

export async function onRequestPost({ request }) {
  try {
    // Read the submitted form values from the page and trim all whitespace before validation.
    const form = await request.formData();

    const firstName = (form.get("fname") || "").toString().trim();
    const lastName = (form.get("lname") || "").toString().trim();
    const email = (form.get("email") || "").toString().trim();
    const comment = (form.get("comment") || "").toString().trim();

    if (!firstName || !lastName || !email || !comment) {
      return json({ ok: false, error: "Please fill in every field." }, 400);
    }

    // MailChannels payload: this formats the message and sets the sender/reply details.
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
