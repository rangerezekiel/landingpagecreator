"use client";

import React from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { FaCheck } from "react-icons/fa6";
import { TbArrowBackUp } from "react-icons/tb";
import PhoneInput from "react-phone-number-input";
import "react-phone-number-input/style.css";
import { FormSubmissionContent } from "@/app/_types/section";
import { submitFormData } from "@/app/_services/form-submission";
import { parsePhoneNumber } from "@/app/_utils/phone";
import { trackMetaEvent } from "@/lib/meta-conversions";
import { toast } from "sonner";
import { useEffect, useState } from "react";

type InquiryOption = {
  key: string;
  label: string;
  badge: string;
};

const INQUIRY_OPTIONS: InquiryOption[] = [
  { key: "price", label: "Official Price List & Floorplan", badge: "A" },
  { key: "whatsapp", label: "Chat on Whatsapp", badge: "B" },
  { key: "showflat", label: "Book Showflat Viewing", badge: "C" },
  { key: "brochure", label: "Official e-brochure", badge: "D" },
];



interface ContactWizardProps {
  className?: string;
  formSubmissionData?: FormSubmissionContent["details"];
  websiteId?: string | null;
}

export default function ContactWizard({ className = "", formSubmissionData, websiteId }: ContactWizardProps) {
  const [step, setStep] = React.useState<number>(0);
  const [selectedKey, setSelectedKey] = React.useState<string>("");
  const [formData, setFormData] = React.useState({
    fullName: "",
    phone: "",
    email: "",
    message: ""
  });
  const [emailError, setEmailError] = React.useState("");
  const [phoneError, setPhoneError] = React.useState("");
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const [projectName, setProjectName] = useState<string>("Tampines St 94 GLS");

  // Form submission data
  const formContent = formSubmissionData?.CONTENT?.value
  
  // Get project name from meta title
  useEffect(() => {
    const getProjectName = () => {
      // Try to get from meta tags first
      const ogTitle = document.querySelector('meta[property="og:title"]')?.getAttribute('content');
      const metaTitle = document.querySelector('meta[name="title"]')?.getAttribute('content');
      const docTitle = document.title;
      
      // Use the first available title, fallback to default
      const title = ogTitle || metaTitle || docTitle || "Tampines St 94 GLS";
      
      setProjectName(title);
    };
    
    getProjectName();
  }, []);


  const selectKey = (key: string) => {
    setSelectedKey(key);
  };

  const handleContinue = async () => {
    if (step === 3) {
      // Final step - submit the form
      setIsSubmitting(true);
      try {
        // Client-side validation before API call
        if (!formData.fullName.trim()) {
          toast.error("Please enter your full name");
          setIsSubmitting(false);
          return;
        }
        
        if (!formData.email.trim()) {
          toast.error("Please enter your email address");
          setIsSubmitting(false);
          return;
        }
        
        if (emailError) {
          toast.error("Please enter a valid email address");
          setIsSubmitting(false);
          return;
        }
        
        if (!formData.phone.trim()) {
          toast.error("Please enter your phone number");
          setIsSubmitting(false);
          return;
        }
        
        if (phoneError) {
          toast.error("Please enter a valid phone number");
          setIsSubmitting(false);
          return;
        }
        
        let countryCode, phoneCode, phoneNumber;
        try {
          const parsed = parsePhoneNumber(formData.phone);
          countryCode = parsed.countryCode;
          phoneCode = parsed.phoneCode;
          phoneNumber = parsed.phoneNumber;
        } catch {
          toast.error("Please enter a valid phone number (at least 8 digits)");
          setIsSubmitting(false);
          return;
        }
        
        const payload = {
          name: formData.fullName,
          email: formData.email,
          phone: formData.phone, // Keep original phone for display
          countryCode: countryCode,
          phoneCode: phoneCode,
          phoneNumber: phoneNumber,
          message: formData.message || `Interest: ${selectedKey}`,
          interest: selectedKey,
          websiteId: websiteId || null,
        };
        
        const response = await submitFormData(payload);
        
        if (response.status === 200 || response.status === 201) {
          trackMetaEvent("Lead", { email: formData.email, phone: formData.phone });
          toast.success("Thank you! Your inquiry has been submitted successfully.");
          setStep(step + 1);
        } else {
          // Handle validation errors
          if (response.status === 422 && response.error && typeof response.error === 'object' && 'errors' in response.error) {
            const validationError = response.error as { errors: Array<{ message: string; field: string; rule: string }> };
            const errorMessages = validationError.errors.map(err => err.message).join(', ');
            toast.error(`Validation Error: ${errorMessages}`);
          } else if (response.status === 400) {
            toast.error("Bad Request: Please check your information and try again.");
          } else if (response.status === 500) {
            toast.error("Server Error: Please try again later.");
          } else {
            toast.error(`Failed to submit your inquiry. (Status: ${response.status})`);
          }
        }
      } catch (error) {
        console.error("Error submitting form:", error);
        // Only show generic error if it's not a phone validation error (already handled above)
        if (!(error instanceof Error && error.message.includes('Phone number'))) {
          toast.error("Something went wrong. Please try again.");
        }
      } finally {
        setIsSubmitting(false);
      }
    } else {
      setStep(step + 1);
    }
  };

  const handleBack = () => {
    setStep(step - 1);
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    
    // Email validation
    if (field === "email") {
      validateEmail(value);
    }
    
    // Phone validation
    if (field === "phone") {
      validatePhone(value);
    }
  };

  const validateEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    
    if (!email) {
      setEmailError("");
    } else if (!emailRegex.test(email)) {
      setEmailError("Please enter a valid email address");
    } else {
      setEmailError("");
    }
  };

  const validatePhone = (phone: string) => {
    const cleanPhone = phone.replace(/[^\d+]/g, '');
    
    if (!phone) {
      setPhoneError("");
    } else if (cleanPhone.length < 8) {
      setPhoneError("Phone number must be at least 8 digits");
    } else {
      setPhoneError("");
    }
  };



  // const handleSubmit: React.FormEventHandler<HTMLFormElement> = (e) => {
  //   e.preventDefault();
  //   const formData = new FormData(e.currentTarget);
  //   const payload = {
  //     fullName: formData.get("fullName") as string,
  //     email: formData.get("email") as string,
  //     phone: formData.get("phone") as string,
  //     message: formData.get("message") as string,
  //     interest: selectedKey,
  //   };
  //   // TODO: integrate API submission
  //   // For now, log to console
  //   // You can replace with your service under app/_services/form-submission.ts
  //   console.log("Contact form submission", payload);
  // };

  return (
    <div className={`w-full flex items-center justify-center max-w-xl relative ${className}`}>
      <div className="relative overflow-hidden">
        <AnimatePresence initial={false} mode="wait">
          {step === 0 && (
            <motion.div
              key="step-1"
              initial={{ y: 40, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: -40, opacity: 0 }}
              transition={{ duration: 0.4, ease: "easeInOut" }}
            >
              <div className="space-y-6">
                <div className="text-white">
                  {formContent ? (
                    <div 
                      className="text-xl sm:text-[24px] font-semibold"
                      dangerouslySetInnerHTML={{ __html: formContent }} 
                    />
                  ) : (
                    <h3 className="text-xl sm:text-[24px] font-semibold">
                      Hi there! Welcome to the official {projectName} concierge. How can we help you?
                    </h3>
                  )}
                </div>

                <a
                  href="https://www.privyr.com/form/96jC7cHK"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-block w-full rounded-[4px] bg-white/20 border border-white/60 px-6 py-4 text-white text-center text-lg font-semibold hover:bg-white/30 transition-colors"
                >
                  Book a Consultation
                </a>

                {/* <div className="flex flex-col gap-3">
                  {INQUIRY_OPTIONS.map((opt) => {
                    const checked = selectedKey === opt.key;
                    return (
                      <label
                        key={opt.key}
                        className={`group flex items-center justify-between rounded-[4px] border px-4 py-3 text-left transition-colors cursor-pointer ${
                          checked
                            ? "border-white/80 bg-[#ffffff3a] text-white"
                            : "border-white/60 bg-[#ffffff1a] text-white/90 hover:bg-[#ffffff3a]"
                        }`}
                      >
                        <span className="flex items-center gap-3">
                          <span className="grid h-6 w-6 place-items-center rounded-[2px] bg-black border border-white text-white text-xs font-bold">
                            {opt.badge}
                          </span>
                          <span className="text-sm sm:text-[20px] font-medium">{opt.label}</span>
                        </span>
                        <input
                          type="radio"
                          name="inquiry"
                          value={opt.key}
                          checked={checked}
                          onChange={() => selectKey(opt.key)}
                          className="sr-only"
                        />
                        {checked && (
                          <FaCheck />
                        )}
                      </label>
                    );
                  })}
                </div> */}

                {/* <div className="flex items-center justify-start">
                  <Button 
                    onClick={handleContinue} 
                    disabled={!selectedKey}
                    className="bg-[#0C6DFD] text-white hover:bg-[#0C6DFD]/90 disabled:bg-[#0C6DFD]/50 disabled:cursor-not-allowed text-[16px] rounded-[4px] !px-5 !py-5"
                  >
                    Next
                  </Button>
                </div> */}
              </div>
            </motion.div>
          )}

          {step === 1 && (
            <motion.div
              key="step-2"
              initial={{ y: 40, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: -40, opacity: 0 }}
              transition={{ duration: 0.4, ease: "easeInOut" }}
            >
              <div className="space-y-6">
                <div className="flex flex-col gap-3">
                  <label className="text-[20px] text-white/80">
                    Name*
                  </label>
                  <input
                    type="text"
                    value={formData.fullName}
                    onChange={(e) => handleInputChange("fullName", e.target.value)}
                    placeholder="Enter your full name"
                    className="!text-[16px] md:!text-[24px] text-white/80 bg-transparent border-0 border-b border-white !rounded-0 !py-2 hover:border-t-0 focus:border-t-0 focus:outline-none [&:-webkit-autofill]:!bg-transparent [&:-webkit-autofill]:!text-white [&:-webkit-autofill]:!shadow-[0_0_0_30px_transparent_inset] [&:-webkit-autofill]:!-webkit-text-fill-color-white [&:-webkit-autofill]:!-webkit-box-shadow-[0_0_0_30px_transparent_inset] [&:-webkit-autofill]:!-webkit-background-clip-text [&:-webkit-autofill]:!-webkit-text-fill-color-white"
                    style={{
                      WebkitBoxShadow: '0 0 0 30px transparent inset',
                      WebkitTextFillColor: 'white',
                      transition: 'background-color 5000s ease-in-out 0s'
                    }}
                  />
                </div>

                <div className="flex items-center gap-2 mt-5">
                  <Button 
                    onClick={handleBack}
                    className="bg-[#33353a] text-white hover:bg-[#050d19]/90 disabled:bg-[#050d19]/50 disabled:cursor-not-allowed text-[16px] rounded-[4px] !px-3 !py-5"
                  >
                    <TbArrowBackUp />
                    Back
                  </Button>
                  <Button 
                    onClick={handleContinue} 
                    disabled={!formData.fullName.trim()}
                    className="bg-[#0C6DFD] text-white hover:bg-[#0C6DFD]/90 disabled:bg-[#0C6DFD]/50 disabled:cursor-not-allowed text-[16px] rounded-[4px] !px-5 !py-5"
                  >
                    Next
                  </Button>
                </div>
              </div>
            </motion.div>
          )}

          {step === 2 && (
            <motion.div
              key="step-3"
              initial={{ y: 40, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: -40, opacity: 0 }}
              transition={{ duration: 0.4, ease: "easeInOut" }}
            >
              <div className="space-y-6">
                <div className="flex flex-col gap-3">
                  <label className="text-[20px] text-white/80">
                    Email*
                  </label>
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) => handleInputChange("email", e.target.value)}
                    placeholder="you@example.com"
                    className={`!text-[16px] md:!text-[24px] text-white/80 bg-transparent border-0 border-b !rounded-0 !py-2 hover:border-t-0 focus:border-t-0 focus:outline-none [&:-webkit-autofill]:!bg-transparent [&:-webkit-autofill]:!text-white [&:-webkit-autofill]:!shadow-[0_0_0_30px_transparent_inset] [&:-webkit-autofill]:!-webkit-text-fill-color-white [&:-webkit-autofill]:!-webkit-box-shadow-[0_0_0_30px_transparent_inset] [&:-webkit-autofill]:!-webkit-background-clip-text [&:-webkit-autofill]:!-webkit-text-fill-color-white ${
                      emailError ? "border-red-400" : "border-white"
                    }`}
                    style={{
                      WebkitBoxShadow: '0 0 0 30px transparent inset',
                      WebkitTextFillColor: 'white',
                      transition: 'background-color 5000s ease-in-out 0s'
                    }}
                  />
                  {emailError && (
                    <span className="text-red-400 text-sm mt-1">
                      {emailError}
                    </span>
                  )}
                </div>

                <div className="flex items-center gap-2 mt-5">
                  <Button 
                    onClick={handleBack}
                    className="bg-[#33353a] text-white hover:bg-[#050d19]/90 disabled:bg-[#050d19]/50 disabled:cursor-not-allowed text-[16px] rounded-[4px] !px-3 !py-5"
                  >
                    <TbArrowBackUp />
                    Back
                  </Button>
                  <Button 
                    onClick={handleContinue} 
                    disabled={!formData.email.trim() || !!emailError}
                    className="bg-[#0C6DFD] text-white hover:bg-[#0C6DFD]/90 disabled:bg-[#0C6DFD]/50 disabled:cursor-not-allowed text-[16px] rounded-[4px] !px-5 !py-5"
                  >
                    Next
                  </Button>
                </div>
              </div>
            </motion.div>
          )}

          {step === 3 && (
            <motion.div
              key="step-4"
              initial={{ y: 40, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: -40, opacity: 0 }}
              transition={{ duration: 0.4, ease: "easeInOut" }}
            >
              <div className="space-y-6">
                <div className="flex flex-col gap-3">
                  <label className="text-[20px] text-white/80">
                    Phone*
                  </label>
                  <PhoneInput
                    international
                    defaultCountry="SG"
                    value={formData.phone}
                    onChange={(value) => handleInputChange("phone", value || "")}
                    placeholder="Enter phone number"
                    className={`!text-[16px] md:!text-[24px] text-white/80 bg-transparent border-0 border-b !rounded-0 !py-2 focus:outline-none [&_.PhoneInputCountry]:!bg-black/20 [&_.PhoneInputCountry]:!text-white [&_.PhoneInputCountry]:!border-0 [&_.PhoneInputCountry]:!rounded-l [&_.PhoneInputCountry]:!px-3 [&_.PhoneInputCountry]:!py-2 [&_.PhoneInputCountrySelect]:!bg-transparent [&_.PhoneInputCountrySelect]:!text-white [&_.PhoneInputCountrySelect]:!border-0 [&_.PhoneInputCountryIcon]:!border-white/20 [&_.PhoneInputInput]:!bg-transparent [&_.PhoneInputInput]:!text-white [&_.PhoneInputInput]:!border-0 [&_.PhoneInputInput]:!focus:outline-none [&_.PhoneInputInput]:!placeholder:text-white/50 [&_.PhoneInputInput:-webkit-autofill]:!bg-transparent [&_.PhoneInputInput:-webkit-autofill]:!text-white [&_.PhoneInputInput:-webkit-autofill]:!shadow-[0_0_0_30px_transparent_inset] [&_.PhoneInputInput:-webkit-autofill]:!-webkit-text-fill-color-white [&_.PhoneInputInput:-webkit-autofill]:!-webkit-box-shadow-[0_0_0_30px_transparent_inset] [&_.PhoneInputInput:-webkit-autofill]:!-webkit-background-clip-text ${
                      phoneError ? "border-red-400" : "border-white"
                    }`}
                  />
                  {phoneError && (
                    <span className="text-red-400 text-sm mt-1">
                      {phoneError}
                    </span>
                  )}
                </div>

                <div className="flex items-center gap-2 mt-5">
                  <Button 
                    onClick={handleBack}
                    className="bg-[#33353a] text-white hover:bg-[#050d19]/90 disabled:bg-[#050d19]/50 disabled:cursor-not-allowed text-[16px] rounded-[4px] !px-3 !py-5"
                  >
                    <TbArrowBackUp />
                    Back
                  </Button>
                  <Button 
                    onClick={handleContinue} 
                    disabled={!formData.phone.trim() || isSubmitting || !!emailError || !!phoneError}
                    className="bg-[#0C6DFD] text-white hover:bg-[#0C6DFD]/90 disabled:bg-[#0C6DFD]/50 disabled:cursor-not-allowed text-[16px] rounded-[4px] !px-5 !py-5"
                  >
                    {isSubmitting ? "Submitting..." : "Submit"}
                  </Button>
                </div>
              </div>
            </motion.div>
          )}

          {step === 4 && (
            <motion.div
              key="step-5"
              initial={{ y: 40, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: -40, opacity: 0 }}
              transition={{ duration: 0.4, ease: "easeInOut" }}
            >
              <div className="space-y-6 text-center">
                <div className="text-white">
                  <h3 className="text-xl sm:text-[24px] font-semibold mb-4">
                    Thank you for your inquiry!
                  </h3>
                  {formContent ? (
                    <div 
                      className="text-white/80 text-[16px]"
                      dangerouslySetInnerHTML={{ __html: formContent }} 
                    />
                  ) : (
                    <p className="text-white/80 text-[16px]">
                      We&apos;ve received your message and our sales team will contact you soon.
                    </p>
                  )}
                </div>

                <div className="flex items-center justify-center gap-2 mt-5">
                  <Button 
                    onClick={() => {
                      setStep(0);
                      setSelectedKey("");
                      setFormData({ fullName: "", phone: "", email: "", message: "" });
                    }}
                    className="bg-[#0C6DFD] text-white hover:bg-[#0C6DFD]/90 text-[16px] rounded-[4px] !px-5 !py-5"
                  >
                    Start Over
                  </Button>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
        
        {/* Single Consent Checkbox - Visible on all steps except thank you page */}
        {/* {step !== 4 && (
          <div className="flex items-start gap-2 text-[15px] text-white/80 mt-6">
            <input 
              type="checkbox" 
              defaultChecked 
              readOnly 
              className="accent-[#2359b7] mt-2 cursor-not-allowed pointer-events-none" 
            />
            <span className="text-white/70">
              By submitting this form, I consent to being contacted by the appointed sales team and associates of {projectName}.
            </span>
          </div>
        )} */}
      </div>
    </div>
  );
}


