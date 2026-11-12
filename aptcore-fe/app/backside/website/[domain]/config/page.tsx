import WebsiteConfigTabs from "./_tabs"
import { Metadata } from "next"

const title = 'Website'

export const metadata: Metadata = {
  title: {
    default: title,
    template: `%s | ${title}`,
  }
}

export default function WebsiteConfig(){
    return (
        <WebsiteConfigTabs/>
    )
}