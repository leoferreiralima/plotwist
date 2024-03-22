import { CreateReviewValues } from '@/hooks/use-reviews/use-reviews.types'
import { supabase } from '@/services/supabase'
import { sanitizeTmdbItem } from '@/utils/tmdb/review/sanitize-tmdb-item'

export const createReviewService = async ({
  userId,
  mediaType,
  rating,
  review,
  tmdbItem,
}: CreateReviewValues) => {
  const tmdbItemValues = sanitizeTmdbItem(tmdbItem)

  const { error, data } = await supabase.from('reviews').insert({
    rating,
    review,
    media_type: mediaType,
    user_id: userId,

    ...tmdbItemValues,
  })

  if (error) throw new Error(error.message)
  return data
}
