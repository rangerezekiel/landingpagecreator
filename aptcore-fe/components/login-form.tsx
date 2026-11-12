import { cn } from "@/lib/utils"
import { Card, CardContent } from "@/components/ui/card"
import Image from "next/image"
import LoginInput from "@/app/login/_input"
import Link from "next/link"

export function LoginForm({
  className,
  ...props
}: React.ComponentProps<"div">) {
  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <Card className="overflow-hidden p-0">
        <CardContent className="grid p-0 md:grid-cols-2">
          <LoginInput />
          <div className="bg-muted relative hidden md:block">
            <Image
              src="/assets/img/bg/auth.webp"
              width={500}
              height={500}
              alt="Login Img"
              className="absolute inset-0 h-full w-full object-cover dark:brightness-[0.2] dark:grayscale"
            />
          </div>
        </CardContent>
      </Card>
      <div className="text-muted-foreground *:[a]:hover:text-primary text-center text-xs text-balance *:[a]:underline *:[a]:underline-offset-4">
        <Link href={'/'} >
          {process.env.NEXT_PUBLIC_APP_NAME}
        </Link>
      </div>
    </div>
  )
}
