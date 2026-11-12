import { Metadata } from "next"
import ThisIndex from "@/app/backside/user-management/user"

const title = 'User'

export const metadata: Metadata = {
  title: {
    default: title,
    template: `%s | ${title}`,
  }
}

export default function UserPage(){
    return (
      <ThisIndex />
    )
}