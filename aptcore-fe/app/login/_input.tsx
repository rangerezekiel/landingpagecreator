'use client'

import { Button } from "@/components/ui/button"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { PasswordInput } from "@/components/ui/password-input"
import { z } from "zod"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { useState } from "react"
import { loginProcess } from "@/app/_services/auth"
import { useAuthStore } from "@/stores/auth"
import { toast } from "sonner"
import { redirect, RedirectType } from "next/navigation"
import SpinnerCaption from "@/components/element/spinner-caption"
import { Activitylog } from '@/lib/activity-log/client'

const formSchema = z.object({
  username: z.string().min(2, "Username must be at least 2 characters.")
                      .max(20, "Username must be less than 20 characters."),
  password: z.string().min(6, "Password must be at least 6 characters."),
})

export default function LoginInput(){

  const [loading, setLoading] = useState(false);

  const mappedInitialData = {
    username: "",
    password: "",
  };

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: mappedInitialData,
  })
  
  async function onSubmit(values: z.infer<typeof formSchema>) {
    setLoading(true);
    
    let loginSuccessful = false;
    let errorMessage: string | null = null;

    try {
      const response = await loginProcess(values);

      if (response.status === 200 && response.data) {
        
        useAuthStore.getState().login({
          user: response.data.user,
          token: "TOKEN_MANAGED_BY_HTTPONLY_COOKIE",
          roles: response.data.roles,
          permissions: response.data.permissions,
        })
        
        // LOG ACTIVITY START
        await Activitylog('USER', 'LOGIN', 'User login successfully', {
          website_id: response.data.user.websiteId,
          user_id: response.data.user.id,
          postFix: '-login'
        })
        // LOG ACTIVITY END

        loginSuccessful = true;
      } else {
        errorMessage = "Failed login, please check your credentials.";
        
        // LOG ACTIVITY START
        await Activitylog('USER', 'LOGIN', `User login failed`,{
          status: 'FAILED',
          payload: values,
          postFix: '-login'
        })
        // LOG ACTIVITY END
      }
    } catch (error) {
      if (error && typeof error === 'object' && 'digest' in error && error.digest === 'NEXT_REDIRECT') {
        console.error("Redirect initiated by Next.js.");
        return;
      }
      errorMessage = "Login failed.";
    } finally {
      setLoading(false);
    }

    if (loginSuccessful) {
      toast.success("Login successfully!");
      redirect('/backside', RedirectType.replace);
    } else if (errorMessage) {
      toast.warning(errorMessage);
    }
    setLoading(false);
  }

  return (
          <>
            <div className="p-6 md:p-8">
              <div className="flex flex-col gap-6">
                <div className="flex flex-col items-center text-center">
                  <h1 className="text-2xl font-bold">Welcome back</h1>
                  <p className="text-muted-foreground text-sm mt-1 text-balance">
                    Enter your Email / Username and Password to enter this app
                  </p>
                </div>
                <Form {...form}>
                  <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
                    <FormField
                      control={form.control}
                      name="username"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Username / Email</FormLabel>
                          <FormControl>
                            <Input placeholder="username / example@mail.com"  disabled={loading} {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="password"
                      render={({ field }) => (
                        <FormItem className="group">
                          <FormLabel>Password</FormLabel>
                          <FormControl>
                            <PasswordInput disabled={loading} {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <Button type="submit" className="w-full" disabled={loading}>
                      <SpinnerCaption loading={loading} loadingValue="Logging..." defaultValue="Login" />
                    </Button>
                  </form>
                </Form>
              </div>
            </div>
          </>
        )

}