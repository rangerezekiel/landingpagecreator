import AccountPageIndex from "@/app/backside/account/_index"
import { Metadata } from "next"

const title = 'Account'
export const metadata: Metadata = {
  title: {
    default: title,
    template: `%s | ${title}`,
  }
}

export default function AccountPage(){
    return (
        <AccountPageIndex />
    )
}