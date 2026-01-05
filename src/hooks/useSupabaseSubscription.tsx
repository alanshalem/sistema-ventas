import type { QueryKey } from '@tanstack/react-query'
import { useQueryClient } from '@tanstack/react-query'
import { useEffect } from 'react'

import { supabase } from '../supabase/supabase.config'

interface UseSupabaseSubscriptionProps {
  channelName: string
  options: Record<string, unknown>
  queryKey: QueryKey
}

export const useSupabaseSubscription = ({
  channelName,
  options,
  queryKey,
}: UseSupabaseSubscriptionProps) => {
  const queryClient = useQueryClient()
  useEffect(() => {
    const subcription = supabase
      .channel(channelName)
      .on('postgres_changes', options as never, (payload: { eventType?: string }) => {
        const { eventType } = payload
        if (eventType && ['INSERT', 'UPDATE', 'DELETE'].includes(eventType)) {
          queryClient.invalidateQueries({ queryKey })
        }
      })
      .subscribe()
    return () => {
      supabase.removeChannel(subcription)
    }
  }, [channelName, options, queryKey, queryClient])
}
