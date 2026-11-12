"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import PhoneInput from "react-phone-number-input";
import "react-phone-number-input/style.css";
import { FaCheck } from "react-icons/fa6";
import { toast } from "sonner";
import { FormSubmissionContent } from "@/app/_types/section";
import { submitFormData } from "@/app/_services/form-submission";
import { parsePhoneNumber } from "@/app/_utils/phone";
import { trackMetaEvent } from "@/lib/meta-conversions";
import { storageUrl } from "@/app/_utils/objectTransformers";
import Image from "next/image";

interface PrivyrFormProps {
  className?: string;
  formSubmissionData?: FormSubmissionContent["details"];
  websiteId?: string | null;
}

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

/**
 * Single-step lead form shown when a website has the Privyr toggle on.
 *
 * The lead is saved by our own API, which then forwards it to Privyr. The
 * webhook URL is resolved server-side and never reaches this component.
 */
export default function PrivyrForm({ className = "", formSubmissionData, websiteId }: PrivyrFormProps) {
  const [formData, setFormData] = useState({ name: "", phone: "", email: "", message: "" });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const formContent = formSubmissionData?.CONTENT?.value;
  const photo = formSubmissionData?.PHOTO?.value;

  const handleChange = (field: keyof typeof formData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit: React.FormEventHandler<HTMLFormElement> = async (e) => {
    e.preventDefault();
    if (isSubmitting) return;

    if (!formData.name.trim()) return toast.error("Please enter your name");
    if (!formData.email.trim() || !EMAIL_REGEX.test(formData.email)) {
      return toast.error("Please enter a valid email address");
    }
    if (!formData.phone?.trim()) return toast.error("Please enter your phone number");

    let parsedPhone;
    try {
      parsedPhone = parsePhoneNumber(formData.phone);
    } catch {
      return toast.error("Please enter a valid phone number (at least 8 digits)");
    }

    setIsSubmitting(true);
    try {
      const response = await submitFormData({
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
        countryCode: parsedPhone.countryCode,
        phoneCode: parsedPhone.phoneCode,
        phoneNumber: parsedPhone.phoneNumber,
        // The API requires a message, so fall back to a marker when left blank.
        message: formData.message || "Submitted via Privyr form",
        websiteId: websiteId || null,
      });

      if (response.status === 200 || response.status === 201) {
        trackMetaEvent("Lead", { email: formData.email, phone: formData.phone });
        toast.success("Thank you! Your inquiry has been submitted successfully.");
        setSubmitted(true);
      } else if (
        response.status === 422 &&
        response.error &&
        typeof response.error === "object" &&
        "errors" in response.error
      ) {
        // Surface the API's field errors instead of a generic failure, so a
        // rejected lead says which field was wrong.
        const validationError = response.error as { errors: Array<{ message: string; field: string }> };
        const errorMessages = validationError.errors
          .map((err) => `${err.field}: ${err.message}`)
          .join(", ");
        console.error("[privyr-form] validation failed:", errorMessages);
        toast.error(`Validation Error: ${errorMessages}`);
      } else {
        console.error("[privyr-form] submit failed:", response.status, JSON.stringify(response.error));
        toast.error(`Failed to submit your inquiry. (Status: ${response.status})`);
      }
    } catch (error) {
      console.error("Error submitting Privyr form:", error);
      toast.error("Something went wrong. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (submitted) {
    return (
      <div className={`w-full max-w-xl relative z-10 flex items-center justify-center ${className}`}>
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="w-full flex flex-col items-center gap-4 rounded-[8px] bg-white px-6 py-12 text-center shadow-2xl"
        >
          <FaCheck className="text-4xl text-[#1a1a1a]" />
          <h3 className="text-xl font-bold text-[#1a1a1a] sm:text-[24px]">Thank you!</h3>
          <p className="text-[#6b7280]">We&apos;ve received your details and will be in touch shortly.</p>
        </motion.div>
      </div>
    );
  }

  return (
    // `relative z-10` lifts the form above the section's absolute ::before
    // overlay, which would otherwise swallow every click. The section stretches
    // this to full height, so `items-center` is what centers the content.
    <div className={`w-full max-w-xl relative z-10 flex items-center justify-center ${className}`}>
      <div className="w-full overflow-hidden rounded-[8px] bg-white shadow-2xl">
        {photo && (
          <Image
            src={storageUrl(photo)}
            alt=""
            width={800}
            height={450}
            className="w-full h-auto object-cover"
          />
        )}

        <div className="space-y-6 p-6 sm:p-8">
          {/* The editor emits headings and paragraphs, so size them here rather
              than relying on the rich text carrying its own styles. */}
          <div className="text-center text-[#1a1a1a] [&_h1]:text-[28px] [&_h1]:font-bold [&_h1]:leading-tight [&_h2]:text-[24px] [&_h2]:font-bold [&_h3]:text-[20px] [&_h3]:font-bold [&_p]:mt-2 [&_p]:text-[16px] [&_p]:leading-relaxed">
            {formContent ? (
              <div dangerouslySetInnerHTML={{ __html: formContent }} />
            ) : (
              <h3 className="text-[20px] font-bold">
                Get in touch and we&apos;ll get back to you shortly.
              </h3>
            )}
          </div>

          <form onSubmit={handleSubmit} className="space-y-3">
            <input
              type="text"
              value={formData.name}
              onChange={(e) => handleChange("name", e.target.value)}
              placeholder="Name"
              disabled={isSubmitting}
              className="autofill-light w-full rounded-[4px] border border-transparent bg-[#f4f4f6] px-4 py-4 text-[#1a1a1a] placeholder:text-[#9ca3af] focus:border-[#d1d5db] focus:outline-none disabled:opacity-60"
            />

            {/* PhoneInput renders its own flex row, so it is styled to match the
                plain inputs above rather than wrapped in another box. */}
            <PhoneInput
              international
              defaultCountry="SG"
              value={formData.phone}
              onChange={(value) => handleChange("phone", value ?? "")}
              disabled={isSubmitting}
              placeholder="Phone Number"
              className="autofill-light w-full rounded-[4px] border border-transparent bg-[#f4f4f6] px-4 py-4 text-[#1a1a1a] disabled:opacity-60 [&_.PhoneInputCountry]:!mr-3 [&_.PhoneInputCountrySelect]:!bg-transparent [&_.PhoneInputCountrySelect]:!text-[#1a1a1a] [&_.PhoneInputCountrySelect]:!border-0 [&_.PhoneInputInput]:!bg-transparent [&_.PhoneInputInput]:!text-[#1a1a1a] [&_.PhoneInputInput]:!border-0 [&_.PhoneInputInput]:!outline-none [&_.PhoneInputInput]:placeholder:!text-[#9ca3af]"
            />

            <input
              type="email"
              value={formData.email}
              onChange={(e) => handleChange("email", e.target.value)}
              placeholder="Email Address"
              disabled={isSubmitting}
              className="autofill-light w-full rounded-[4px] border border-transparent bg-[#f4f4f6] px-4 py-4 text-[#1a1a1a] placeholder:text-[#9ca3af] focus:border-[#d1d5db] focus:outline-none disabled:opacity-60"
            />

            <textarea
              value={formData.message}
              onChange={(e) => handleChange("message", e.target.value)}
              placeholder="How can I help you?"
              rows={4}
              disabled={isSubmitting}
              className="autofill-light w-full resize-y rounded-[4px] border border-transparent bg-[#f4f4f6] px-4 py-4 text-[#1a1a1a] placeholder:text-[#9ca3af] focus:border-[#d1d5db] focus:outline-none disabled:opacity-60"
            />

            <button
              type="submit"
              disabled={isSubmitting}
              className="flex w-full items-center justify-center gap-2 rounded-[4px] bg-gradient-to-r from-[#4facfe] via-[#8b5cf6] to-[#e935f4] px-6 py-4 text-lg font-bold tracking-wide text-white transition-opacity hover:opacity-90 disabled:opacity-60"
            >
              <FaCheck />
              {isSubmitting ? "SUBMITTING..." : "SUBMIT"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
