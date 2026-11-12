import { Metadata } from "next"
import ThisIndex from "@/app/backside/activity-log"

const title = 'Activity Log'

export const metadata: Metadata = {
  title: {
    default: title,
    template: `%s | ${title}`,
  }
}

export default function ActivityLogPage(){
    return (
      <ThisIndex />
    )
}