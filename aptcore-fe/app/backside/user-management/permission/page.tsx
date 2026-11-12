import { Metadata } from "next"
import ThisIndex from "@/app/backside/user-management/permission"

const title = 'Permission'

export const metadata: Metadata = {
  title: {
    default: title,
    template: `%s | ${title}`,
  }
}

export default function PermissionPage(){
    return (
      <ThisIndex />
    )
}