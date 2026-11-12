import Animated from "@/components/animated"
import ContactWizard from "@/components/web-template/theme/t01/partial/contact-wizard"
import PrivyrForm from "@/components/web-template/theme/t01/partial/privyr-form"
import { FormSubmissionContent } from "@/app/_types/section"
import { storageUrl } from "@/app/_utils/objectTransformers"

interface FormSubmissionProps {
  data?: FormSubmissionContent["details"]
  websiteId?: string | null
}

export default function FormSubmission({ data, websiteId }: FormSubmissionProps) {
  if (!data) {
    return null
  }

  const usePrivyrForm = data?.PRIVYR_ENABLED?.value === "true"

  // The API already strips the webhook URL for public readers. Drop it again
  // here so a secret can never ride into a client component via props.
  const { PRIVYR_WEBHOOK_URL: _webhookUrl, ...publicData } = data
  void _webhookUrl

  return (
    <Animated animation="fade-up" delay={0.2} className="relative">
      {/* min-h rather than a fixed height: the Privyr card grows with its photo
          and rich text, and a hard height would clip it. */}
      <div
        id="contact"
        className="relative min-h-[941px] flex items-center py-12 md:py-16 lg:py-20 bg-cover bg-center before:content-[''] before:w-full before:h-full before:absolute before:bottom-0 before:left-0 before:bg-gradient-to-t before:bg-black/25 to-transparent"
        style={{
          backgroundImage: data?.BACKGROUND?.value 
            ? `url(${storageUrl(data.BACKGROUND.value)})`
            : "url('/assets/theme/t01/bg-contact.jpg')"
        }}
      >
        <div className="container px-4 flex justify-center h-full">
          {usePrivyrForm ? (
            <PrivyrForm
              formSubmissionData={publicData}
              websiteId={websiteId}
            />
          ) : (
            <ContactWizard
              formSubmissionData={publicData}
              websiteId={websiteId}
            />
          )}
        </div>
      </div>
    </Animated>
  )
}
