'use client'

import { useInView } from 'react-intersection-observer'
import { forwardRef, useEffect } from 'react'
import { useInfiniteQuery } from '@tanstack/react-query'
import { useSearchParams } from 'next/navigation'

import { MovieCard, MovieCardSkeleton } from '@/components/movie-card'
import { Language } from '@/types/languages'

import { tmdb } from '@/services/tmdb'
import { MovieListType } from '@/services/tmdb/requests/movies/list'

const MovieListSkeleton = forwardRef<HTMLDivElement>((_, ref) => (
  <div
    className="grid w-full grid-cols-1 gap-x-4 gap-y-8 md:grid-cols-3"
    ref={ref}
  >
    {Array.from({ length: 10 }).map((_, i) => (
      <MovieCardSkeleton key={i} />
    ))}
  </div>
))
MovieListSkeleton.displayName = 'MovieListSkeleton'

type Variant = MovieListType | 'discover'

type MovieListContentProps = {
  variant: Variant
  language: Language
}

export const MovieList = ({ variant, language }: MovieListContentProps) => {
  const { ref, inView } = useInView({
    threshold: 0,
  })

  const searchParams = useSearchParams()

  const genres = searchParams.get('genres')
  const startDate = searchParams.get('release_date.gte')
  const endDate = searchParams.get('release_date.lte')
  const originaLanguage = searchParams.get('with_original_language')
  const sortBy = searchParams.get('sort_by')
  const withWatchProviders = searchParams.get('with_watch_providers')
  const watchRegion = searchParams.get('watch_region')

  const voteAverageStart = searchParams.get('vote_average.gte')
  const voteAverageEnd = searchParams.get('vote_average.lte')

  const voteCountStart = searchParams.get('vote_count.gte')

  const { data, fetchNextPage } = useInfiniteQuery({
    queryKey: [
      variant,
      genres,
      startDate,
      endDate,
      originaLanguage,
      sortBy,
      withWatchProviders,
      watchRegion,
      voteAverageStart,
      voteAverageEnd,
    ],

    queryFn: ({ pageParam }) =>
      variant === 'discover'
        ? tmdb.movies.discover({
            filters: {
              with_genres: genres,
              'release_date.gte': startDate,
              'release_date.lte': endDate,
              with_original_language: originaLanguage,
              sort_by: sortBy,
              with_watch_providers: withWatchProviders,
              watch_region: watchRegion,
              'vote_average.gte': voteAverageStart,
              'vote_average.lte': voteAverageEnd,
              'vote_count.gte': voteCountStart,
            },
            language,
            page: pageParam,
          })
        : tmdb.movies.list({
            language,
            list: variant,
            page: pageParam,
          }),
    getNextPageParam: (lastPage) => lastPage.page + 1,
    initialPageParam: 1,
  })

  useEffect(() => {
    if (inView) fetchNextPage()
  }, [fetchNextPage, inView])

  if (!data) return <MovieListSkeleton />

  const flatData = data.pages.flatMap((page) => page.results)
  const isLastPage =
    data.pages[data.pages.length - 1].page >=
    data.pages[data.pages.length - 1].total_pages

  return (
    <>
      <div className="flex items-center justify-between">
        <div className="grid w-full grid-cols-1 gap-x-4 gap-y-8 md:grid-cols-3">
          {flatData.map((movie) => (
            <MovieCard movie={movie} key={movie.id} language={language} />
          ))}

          {!isLastPage && (
            <>
              <MovieCardSkeleton ref={ref} />
              <MovieCardSkeleton />
              <MovieCardSkeleton />
            </>
          )}
        </div>
      </div>
    </>
  )
}