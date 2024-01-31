import { PageProps } from '@/types/languages'
import { TvShowList } from '../../components/tv-show-list'
import { getDictionary } from '@/utils/dictionaries'

const OnTheAirTvShowsPage = async ({ params: { lang } }: PageProps) => {
  const {
    tv_show_pages: {
      on_the_air: { title, description },
    },
  } = await getDictionary(lang)

  return (
    <div className="mx-auto max-w-5xl space-y-4 px-4 py-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">{title}</h1>
          <p className="text-muted-foreground">{description}</p>
        </div>
      </div>

      <TvShowList variant="on_the_air" language={lang} />
    </div>
  )
}

export default OnTheAirTvShowsPage
