import { supabase } from '@/services/supabase'
import { Language } from '@/types/languages'
import { Review } from '@/types/supabase/reviews'

export type FullReview = Review & {
  likes_count: number
}

export type ReviewsOrderedByLikes = FullReview[]

const MAX_REVIEWS = 5

export const getPopularReviewsService = async (language: Language) => {
  const { error, data } = await supabase
    .from('reviews_ordered_by_likes')
    .select()
    .limit(MAX_REVIEWS)
    .eq('language', language)
    .returns<ReviewsOrderedByLikes>()

  if (error) throw new Error(error.message)

  return data
}
