"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { generateLemonSqueezySessionAction, checkStoreStatusAction } from "@/components/lemonSqueezy/buy-credits/actions"
import { toast } from "sonner"
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog"

export function CheckoutButton({
  credits,
  className,
  children,
  disabled
}: {
  credits: number
  className?: string
  children: React.ReactNode
  disabled?: boolean
}) {
  const [loading, setLoading] = useState(false)
  const [isPending, setIsPending] = useState(true)

  useEffect(() => {
    const checkStatus = async () => {
      try {
        const [result] = await checkStoreStatusAction();
        if (result) {
          setIsPending(result.isPending);
        }
      } catch (error) {
        console.error("Failed to check store status:", error);
      }
    };
    
    checkStatus();
  }, []);

  const handleCheckout = async () => {
    try {
      setLoading(true)
      const [url, error] = await generateLemonSqueezySessionAction({ credits })
      if (error) {
        throw new Error(error.message)
      }
      if (url) {
        window.location.href = url
      }
    } catch (error) {
      toast.error("Failed to create checkout session")
      console.error(error)
    } finally {
      setLoading(false)
    }
  }

  if (isPending) {
    return (
      <AlertDialog>
        <AlertDialogTrigger asChild>
          <Button
            className={`w-full sm:w-auto bg-primary text-primary-foreground hover:bg-primary/90 shadow-lg hover:shadow-xl transition-all ${className}`}
            size="lg"
          >
            {children}
          </Button>
        </AlertDialogTrigger>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Payment System Coming Soon</AlertDialogTitle>
            <AlertDialogDescription>
              We're currently in the process of setting up our payment system. Your account will be credited with 10 free credits to get started. We'll notify you when credit purchases become available!
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Close</AlertDialogCancel>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    )
  }

  return (
    <Button
      onClick={handleCheckout}
      disabled={loading || disabled}
      className={`w-full sm:w-auto bg-primary text-primary-foreground hover:bg-primary/90 shadow-lg hover:shadow-xl transition-all ${className}`}
      size="lg"
    >
      {loading ? "Loading..." : children}
    </Button>
  )
}