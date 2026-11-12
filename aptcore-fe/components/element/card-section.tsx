import Image from "next/image"
import Link from "next/link"
import { Switch } from "../ui/switch"
import { Label } from "../ui/label"
import { useState } from "react"
import { updateDataActive } from "@/app/_services/section"
import { FetchApiResponse } from "@/app/_types/fetch"
import { Section } from "@/app/_types/section"
import { toast } from "sonner"
import { LoaderCircle } from 'lucide-react';

type CardType = {
  domain: string
  section: string
  link: string
  image: string
  title: string
  width?: number
  height?: number
  className?: string
  defaultActive?: boolean
  withoutSwitch?: boolean
}

export default function CardSection({
  domain,
  section,
  link,
  image,
  title,
  width = 145,
  height = 145,
  className,
  defaultActive = false,
  withoutSwitch = false,
}: CardType) {
  const [isActive, setIsActive] = useState(defaultActive)
  const [isLoading, setIsLoading] = useState(false)

  const updateActive = async (checked: boolean) => {
    setIsLoading(true)
    
    try {
        const data = await updateDataActive(domain, section, checked) as unknown as FetchApiResponse<Section>
        if(data.status === 200) {
            toast.success("Data updated successfully!");
            setIsActive(checked)
        } else {
            toast.error("Failed to save data!");
        }
      } catch (err) {
          console.error("Error fetching user data:", err)
      } finally {
          setIsLoading(false)
      }
  }

  return (
    <div
      className={`${className} group block rounded-xl border p-4 text-center shadow-sm transition-all duration-300 ease-in-out hover:shadow-lg hover:scale-[1.03] hover:border-zinc-500 hover:bg-zinc-50 dark:bg-gray-600 dark:text-black`}
    >

      {/* Link Area */}
      <Link href={link}>
        <div className="w-full h-50 flex justify-center items-center transition-transform duration-300 group-hover:scale-110">
          <Image
            alt=""
            src={`/assets/img/icons/${image}`}
            width={width}
            height={height}
            className="rounded-md"
          />
        </div>

        <div className="mt-3 transition-colors duration-300 group-hover:text-zinc-600 dark:group-hover:text-zinc-400">
          <p className="font-semibold text-lg">{title}</p>
        </div>
        </Link>
          {/* Switch */}
          {isLoading ? (
            <>
              <div className="my-3 items-center justify-center flex gap-1 text-zinc-500">
                <LoaderCircle className="animate-spin size-5" />
                <span className="italic">
                  Saving status...
                </span>
              </div>
            </>
          ) : (
            <>
              {!withoutSwitch && (
                <>
                  <div className="my-3 items-center justify-center flex gap-2">
                    <Switch
                      className="cursor-pointer"
                      id={`active-switch-${section}`}
                      checked={isActive}
                      onCheckedChange={updateActive}
                    />
                    <Label htmlFor={`active-switch-${section}`} className="text-sm font-medium cursor-pointer">
                      Active
                    </Label>
                  </div>
                </>
              )}
            </>
          )}
    </div>
  )
}
