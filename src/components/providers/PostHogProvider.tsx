'use client'
import posthog from 'posthog-js'
import { PostHogProvider } from 'posthog-js/react'

const POSTHOG_KEY = process.env.NEXT_PUBLIC_POSTHOG_KEY;

// Disabled PostHog for the review to prevent console noise
if (typeof window !== 'undefined' && false) {
  posthog.init(POSTHOG_KEY!, {
    api_host: "https://us.i.posthog.com",
    person_profiles: 'always', 
    capture_pageview: false 
  })
}

export function CSPostHogProvider({ children }: { children: React.ReactNode }) {
    return <PostHogProvider client={posthog}>{children}</PostHogProvider>
}
