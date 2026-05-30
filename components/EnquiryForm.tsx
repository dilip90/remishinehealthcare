'use client';

import { FormEvent, useState } from 'react';
import { addDoc, serverTimestamp } from 'firebase/firestore';
import { CheckCircle2, Send } from 'lucide-react';
import { firebaseCollections } from '@/lib/firebaseCollections';

const enquiryRecipient = 'pathak87pawan@gmail.com'; // pathak87pawan@gmail.com
const enquiryCc = 'techtitan0190@gmail.com';

type EnquiryFormValues = {
  name: string;
  phone: string;
  email: string;
  message: string;
};

type EnquiryFormErrors = Partial<Record<keyof EnquiryFormValues | 'submit', string>>;

function escapeHtml(value: string) {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

export default function EnquiryForm() {
  const [status, setStatus] = useState<'idle' | 'sending' | 'sent' | 'error'>('idle');
  const [values, setValues] = useState<EnquiryFormValues>({
    name: '',
    phone: '',
    email: '',
    message: '',
  });
  const [errors, setErrors] = useState<EnquiryFormErrors>({});

  function updateValue(field: keyof EnquiryFormValues, value: string) {
    setValues((currentValues) => ({ ...currentValues, [field]: value }));
    setErrors((currentErrors) => ({ ...currentErrors, [field]: undefined, submit: undefined }));
    if (status === 'sent') {
      setStatus('idle');
    }
  }

  function validateForm(formValues: EnquiryFormValues) {
    const nextErrors: EnquiryFormErrors = {};
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const phonePattern = /^[0-9+\-\s()]{7,20}$/;

    if (!formValues.name.trim()) {
      nextErrors.name = 'Please enter your name.';
    } else if (formValues.name.trim().length < 2) {
      nextErrors.name = 'Name must be at least 2 characters.';
    }

    if (!formValues.phone.trim()) {
      nextErrors.phone = 'Please enter your phone number.';
    } else if (!phonePattern.test(formValues.phone.trim())) {
      nextErrors.phone = 'Please enter a valid phone number.';
    }

    if (formValues.email.trim() && !emailPattern.test(formValues.email.trim())) {
      nextErrors.email = 'Please enter a valid email address.';
    }

    if (!formValues.message.trim()) {
      nextErrors.message = 'Please enter your enquiry message.';
    } else if (formValues.message.trim().length < 3) {
      nextErrors.message = 'Message must be at least 3 characters.';
    }

    return nextErrors;
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const name = values.name.trim();
    const phone = values.phone.trim();
    const email = values.email.trim();
    const message = values.message.trim();
    const validationErrors = validateForm({ name, phone, email, message });

    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      setStatus('error');
      return;
    }

    setStatus('sending');

    const textBody = [
      'New website enquiry',
      '',
      `Name: ${name}`,
      `Phone: ${phone}`,
      `Email: ${email || 'Not provided'}`,
      '',
      'Message:',
      message,
    ].join('\n');

    const htmlBody = `
      <h2>New website enquiry</h2>
      <p><strong>Name:</strong> ${escapeHtml(name)}</p>
      <p><strong>Phone:</strong> ${escapeHtml(phone)}</p>
      <p><strong>Email:</strong> ${escapeHtml(email || 'Not provided')}</p>
      <p><strong>Message:</strong></p>
      <p>${escapeHtml(message).replace(/\n/g, '<br />')}</p>
    `;

    try {
      await addDoc(firebaseCollections.enquiries, {
        name,
        phone,
        ...(email ? { email } : {}),
        message,
        status: 'new',
        createdAt: serverTimestamp(),
      });

      await addDoc(firebaseCollections.mail, {
        to: [enquiryRecipient],
        cc: [enquiryCc],
        ...(email ? { replyTo: [email] } : {}),
        message: {
          subject: 'New Product Enquiry - Remishine Healthcare Website',
          text: textBody,
          html: htmlBody,
        },
        createdAt: serverTimestamp(),
      });

      setValues({
        name: '',
        phone: '',
        email: '',
        message: '',
      });
      setErrors({});
      setStatus('sent');
    } catch (error) {
      console.error('Unable to submit enquiry', error);
      setErrors({
        submit: 'We could not send your enquiry right now. Please try again shortly.',
      });
      setStatus('error');
    }
  }

  return (
    <form onSubmit={handleSubmit} className="rounded-lg border border-slate-200 bg-white p-6 shadow-sm">
      <h2 className="text-2xl font-bold text-slate-950">Send an enquiry</h2>
      <div className="mt-6 grid gap-4 sm:grid-cols-2">
        <label className="grid gap-2 text-sm font-semibold text-slate-700">
          Name
          <input
            name="name"
            value={values.name}
            onChange={(event) => updateValue('name', event.target.value)}
            aria-invalid={Boolean(errors.name)}
            aria-describedby={errors.name ? 'enquiry-name-error' : undefined}
            className="rounded-lg border border-slate-300 px-3 py-3 font-normal outline-none focus:border-primary"
          />
          {errors.name && <span id="enquiry-name-error" className="text-xs font-semibold text-red-600">{errors.name}</span>}
        </label>
        <label className="grid gap-2 text-sm font-semibold text-slate-700">
          Phone
          <input
            name="phone"
            value={values.phone}
            onChange={(event) => updateValue('phone', event.target.value)}
            aria-invalid={Boolean(errors.phone)}
            aria-describedby={errors.phone ? 'enquiry-phone-error' : undefined}
            className="rounded-lg border border-slate-300 px-3 py-3 font-normal outline-none focus:border-primary"
          />
          {errors.phone && <span id="enquiry-phone-error" className="text-xs font-semibold text-red-600">{errors.phone}</span>}
        </label>
        <label className="grid gap-2 text-sm font-semibold text-slate-700 sm:col-span-2">
          Email
          <input
            name="email"
            type="email"
            value={values.email}
            onChange={(event) => updateValue('email', event.target.value)}
            aria-invalid={Boolean(errors.email)}
            aria-describedby={errors.email ? 'enquiry-email-error' : undefined}
            className="rounded-lg border border-slate-300 px-3 py-3 font-normal outline-none focus:border-primary"
          />
          {errors.email && <span id="enquiry-email-error" className="text-xs font-semibold text-red-600">{errors.email}</span>}
        </label>
        <label className="grid gap-2 text-sm font-semibold text-slate-700 sm:col-span-2">
          Message
          <textarea
            name="message"
            rows={5}
            value={values.message}
            onChange={(event) => updateValue('message', event.target.value)}
            aria-invalid={Boolean(errors.message)}
            aria-describedby={errors.message ? 'enquiry-message-error' : undefined}
            className="resize-none rounded-lg border border-slate-300 px-3 py-3 font-normal outline-none focus:border-primary"
          />
          {errors.message && <span id="enquiry-message-error" className="text-xs font-semibold text-red-600">{errors.message}</span>}
        </label>
      </div>
      <div className="mt-5 flex flex-wrap items-center gap-3">
        <button
          type="submit"
          disabled={status === 'sending'}
          className="inline-flex items-center gap-2 rounded-lg bg-primary px-5 py-3 text-sm font-semibold text-white transition hover:bg-primary-dark disabled:cursor-not-allowed disabled:opacity-70"
        >
          <Send className="h-4 w-4" />
          {status === 'sending' ? 'Sending...' : 'Send Enquiry'}
        </button>
      </div>
      {status === 'sent' && (
        <div className="mt-5 flex gap-3 rounded-lg border border-green-200 bg-green-50 p-4 text-sm text-green-800">
          <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0" />
          <p>
            Thank you for contacting Remishine Healthcare. Your enquiry has been submitted successfully,
            and our team will get back to you soon.
          </p>
        </div>
      )}
      {errors.submit && (
        <p className="mt-4 text-sm font-semibold text-red-600">{errors.submit}</p>
      )}
    </form>
  );
}
