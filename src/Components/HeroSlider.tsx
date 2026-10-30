import { useEffect, useRef, useState } from 'react'
import { Volume2, VolumeX } from 'lucide-react'

type HeroSlide = {
  type: 'image' | 'video'
  url?: string
  videoId?: string
  title?: string
  highlight?: string
  script?: string
  sub?: string
  duration: number
}

const heroSlides: HeroSlide[] = [
  {
    type: 'image',
    url: 'https://i.pinimg.com/736x/86/9a/f5/869af5b25668265d4bd4873b681e8e5c.jpg',
    highlight: 'FLANEUR',
    duration: 6000, // 6 seconds for image
  },
  {
    type: 'video',
    videoId: 'YOncSEfce-c',
    sub: 'JENNIE FT. EDISON CHEN',
    duration: 45000, // 45 seconds for Video 1
  },
  {
    type: 'video',
    videoId: 'BwP0HcRDh4o',
    title: 'ADIDAS ORIGINALS',
    highlight: 'BY JENNIE',
    sub: 'EXPLORE THE NEW CAMPAIGN',
    duration: 43000, // 43 seconds for Video 2
  },
  {
    type: 'image',
    url: 'https://i.pinimg.com/736x/ef/37/fc/ef37fca175434b8117d875da6124caa3.jpg',
    title: 'WEAR IT WITH',
    highlight: 'CONFIDENCE',
    script: 'Style',
    sub: 'PRE FINAL REACT BASED APPLICATION - FUEGO',
    duration: 6000, // 6 seconds for image
  },
]

export default function HeroSlider() {
  const [currentSlide, setCurrentSlide] = useState(0)
  const [mutedSlides, setMutedSlides] = useState<Record<number, boolean>>(() =>
    Object.fromEntries(heroSlides.flatMap((slide, index) => slide.type === 'video' ? [[index, true]] : [])),
  )
  const iframeRefs = useRef<Record<number, HTMLIFrameElement | null>>({})
  const activeSlide = heroSlides[currentSlide]
  const isActiveVideo = activeSlide.type === 'video'
  const isMuted = mutedSlides[currentSlide] ?? true

  useEffect(() => {
    const currentDuration = heroSlides[currentSlide].duration
    const timer = window.setTimeout(() => {
      setCurrentSlide((slide) => (slide + 1) % heroSlides.length)
    }, currentDuration)

    return () => window.clearTimeout(timer)
  }, [currentSlide])

  const sendMuteCommand = (index: number, muted: boolean) => {
    iframeRefs.current[index]?.contentWindow?.postMessage(
      JSON.stringify({ event: 'command', func: muted ? 'mute' : 'unMute', args: [] }),
      'https://www.youtube.com',
    )
  }

  const toggleMute = () => {
    const nextMuted = !isMuted
    setMutedSlides((current) => ({ ...current, [currentSlide]: nextMuted }))
    sendMuteCommand(currentSlide, nextMuted)
  }

  return (
    <section className="relative flex min-h-[380px] items-center overflow-hidden rounded-3xl border border-slate-200 bg-gradient-to-br from-slate-100 to-slate-200 shadow-xl dark:border-zinc-800 dark:from-zinc-900 dark:to-zinc-950 md:min-h-[460px]">
      {heroSlides.map((slide, index) => {
        const isActive = index === currentSlide

        return (
          <div
            key={(slide.title ?? slide.videoId ?? slide.url ?? 'slide') + index}
            aria-hidden={!isActive}
            className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${isActive ? 'z-10 opacity-100' : 'pointer-events-none z-0 opacity-0'}`}
          >
            {slide.type === 'video' ? (
              <>
                {isActive && (
                  <iframe
                    ref={(iframe) => {
                      iframeRefs.current[index] = iframe
                    }}
                    src={`https://www.youtube.com/embed/${slide.videoId}?autoplay=1&mute=1&loop=1&playlist=${slide.videoId}&controls=0&enablejsapi=1&origin=${encodeURIComponent(window.location.origin)}`}
                    title={slide.title}
                    className="h-full w-full object-cover pointer-events-none scale-150"
                    allow="autoplay; encrypted-media"
                    onLoad={() => sendMuteCommand(index, mutedSlides[index] ?? true)}
                  />
                )}
              </>
            ) : (
              <img src={slide.url} alt="" className="h-full w-full object-cover" />
            )}

            <div className="absolute inset-0 flex flex-col justify-center space-y-3 bg-gradient-to-r from-black/60 via-black/30 to-transparent px-8 text-white md:px-16">
              <p className="text-xs font-semibold uppercase tracking-widest text-lime-400">{slide.sub}</p>
              <h1 className="text-3xl font-black uppercase leading-tight tracking-wider md:text-5xl">
                {slide.title}<br />
                <span className="bg-gradient-to-r from-white via-slate-200 to-slate-400 bg-clip-text text-transparent">{slide.highlight}</span>
              </h1>
              <p className="font-serif text-3xl italic text-lime-300 md:text-5xl">{slide.script}</p>
            </div>
          </div>
        )
      })}

      <div className="absolute bottom-4 left-1/2 z-20 flex -translate-x-1/2 space-x-2">
        {heroSlides.map((slide, index) => (
          <button
            key={(slide.title ?? slide.videoId ?? slide.url ?? 'slide') + index}
            type="button"
            onClick={() => setCurrentSlide(index)}
            aria-label={`Show slide ${index + 1}`}
            aria-current={index === currentSlide}
            className={`h-2.5 rounded-full transition-all duration-300 ${index === currentSlide ? 'w-8 bg-lime-400' : 'w-2.5 bg-white/50'}`}
          />
        ))}
      </div>
      {isActiveVideo && (
        <button
          type="button"
          onClick={toggleMute}
          aria-pressed={isMuted}
          aria-label={isMuted ? 'Unmute video' : 'Mute video'}
          title={isMuted ? 'Unmute video' : 'Mute video'}
          className="absolute right-4 top-4 z-30 rounded-full bg-black/60 p-3 text-white shadow backdrop-blur-md transition hover:bg-black/80 focus:outline-none focus:ring-2 focus:ring-white"
        >
          {isMuted ? <VolumeX className="h-5 w-5" /> : <Volume2 className="h-5 w-5" />}
        </button>
      )}
    </section>
  )
}