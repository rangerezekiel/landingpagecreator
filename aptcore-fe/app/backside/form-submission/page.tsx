import { Metadata } from "next"
import ThisIndex from "@/app/backside/form-submission"

const title = 'Form Submission'

export const metadata: Metadata = {
  title: {
    default: title,
    template: `%s | ${title}`,
  }
}

export default function FormSubmissionPage(){
    return (
      <ThisIndex />
    )
}