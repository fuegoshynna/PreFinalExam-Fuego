import { useEffect, useState } from 'react'

const heroSlides = [
  {
    type: 'image',
    url: 'https://images.unsplash.com/photo-1490481651871-ab68de25d43d?auto=format&fit=crop&q=80&w=1600',
    title: 'WEAR IT WITH',
    highlight: 'CONFIDENCE',
    script: 'Style',
    sub: 'PRE FINAL REACT BASED APPLICATION - FUEGO',
  },
  {
    type: 'video',
    url: 'https://assets.mixkit.co/videos/preview/mixkit-model-walking-on-a-fashion-runway-41238-large.mp4',
    title: 'AUTUMN / WINTER',
    highlight: 'COLLECTION',
    script: 'Elegance',
    sub: 'EXPLORE NEW DESIGNS FOR THE SEASON',
  },
  {
    type: 'image',
    url: 'https://images.unsplash.com/photo-1445205170230-053b83016050?auto=format&fit=crop&q=80&w=1600',
    title: 'MINIMAL & SECURE',
    highlight: 'FLÂNEUR',
    script: 'Couture',
    sub: 'CRAFTED FOR THE MODERN AESTHETE',
  },
]

export default function HeroSlider() {
  const [currentSlide, setCurrentSlide] = useState(0)

  useEffect(() => {
    const timer = window.setInterval(() => {
      setCurrentSlide((slide) => (slide + 1) % heroSlides.length)
    }, 6000)
    return () => window.clearInterval(timer)
  }, [])

  return (
    <section className="relative flex min-h-[380px] items-center overflow-hidden rounded-3xl border border-slate-200 bg-gradient-to-br from-slate-100 to-slate-200 shadow-xl dark:border-zinc-800 dark:from-zinc-900 dark:to-zinc-950 md:min-h-[460px]">
      {heroSlides.map((slide, index) => (
        <div
          key={slide.title}
          aria-hidden={index !== currentSlide}
          className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${index === currentSlide ? 'z-10 opacity-100' : 'pointer-events-none z-0 opacity-0'}`}
        >
          {slide.type === 'video' ? (
            <video autoPlay loop muted playsInline className="h-full w-full object-cover">
              <source src={slide.url} type="video/mp4" />
            </video>
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
      ))}
      <div className="absolute bottom-4 left-1/2 z-20 flex -translate-x-1/2 space-x-2">
        {heroSlides.map((slide, index) => (
          <button
            key={slide.title}
            type="button"
            onClick={() => setCurrentSlide(index)}
            aria-label={`Show slide ${index + 1}`}
            aria-current={index === currentSlide}
            className={`h-2.5 rounded-full transition-all duration-300 ${index === currentSlide ? 'w-8 bg-lime-400' : 'w-2.5 bg-white/50'}`}
          />
        ))}
      </div>
    </section>
  )
}
