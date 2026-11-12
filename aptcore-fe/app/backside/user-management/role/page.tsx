import { Metadata } from "next"
import ThisIndex from "@/app/backside/user-management/role"

const title = 'Role'

export const metadata: Metadata = {
  title: {
    default: title,
    template: `%s | ${title}`,
  }
}

export default function RolePage(){
    return (
      <ThisIndex />
    )
}