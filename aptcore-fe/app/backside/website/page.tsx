import { Metadata } from "next"
import IndexPage from "./_index_page"

const title = 'Website'

export const metadata: Metadata = {
  title: {
    default: title,
    template: `%s | ${title}`,
  }
}

export default function WebsitePage(){
    return (
      <IndexPage />
    )
}