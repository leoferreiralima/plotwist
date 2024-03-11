'use client'

import { useLists } from '@/context/lists'
import { useLanguage } from '@/context/language'

import { ListCard, ListCardSkeleton } from './list-card'
import { ListForm } from './list-form'
import { useAuth } from '@/context/auth'
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip'
import { TooltipPortal } from '@radix-ui/react-tooltip'
import Link from 'next/link'

const LISTS_LIMIT = process.env.NODE_ENV === 'development' ? 10 : 1

export const Lists = () => {
  const { lists, isLoading } = useLists()
  const { dictionary, language } = useLanguage()
  const { user } = useAuth()

  if (!user) {
    return (
      <div className="grid-cols:1 grid gap-x-4 gap-y-8 md:grid-cols-2 xl:grid-cols-3">
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <button className="aspect-video cursor-not-allowed rounded-md border border-dashed opacity-50">
                {dictionary.list_form.create_new_list}
              </button>
            </TooltipTrigger>

            <TooltipPortal>
              <TooltipContent>
                <Link href={`/${language}/login`}>
                  {dictionary.list_form.tooltip_no_account}
                </Link>
              </TooltipContent>
            </TooltipPortal>
          </Tooltip>
        </TooltipProvider>
      </div>
    )
  }

  if (isLoading)
    return (
      <div className="grid-cols:1 grid gap-x-4 gap-y-8 md:grid-cols-2 xl:grid-cols-3">
        {Array.from({ length: 3 }).map((_, index) => (
          <ListCardSkeleton key={index} />
        ))}
      </div>
    )

  return (
    <div className="grid-cols:1 grid gap-x-4 gap-y-8 md:grid-cols-2 xl:grid-cols-3">
      {lists.map((list) => (
        <ListCard key={list.id} list={list} />
      ))}

      {lists.length < LISTS_LIMIT && (
        <ListForm
          trigger={
            <button className="aspect-video rounded-md border border-dashed">
              {dictionary.list_form.create_new_list}
            </button>
          }
        />
      )}
    </div>
  )
}
