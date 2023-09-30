import Image from 'next/image'

export default function Home() {
  return (
    <main className='mx-auto w-full max-w-sm'>
      <div className="h-screen">
        <Image
          src="/sara-hero.jpg"
          alt="Picture of Sara El-Shawa"
          width={500}
          height={500}
        />
        <Image
          src="/robot.gif"
          alt="Picture of Sara El-Shawa"
          width={500}
          height={500}
        />
        <Image
          src="/social.gif"
          alt="Picture of Sara El-Shawa"
          width={500}
          height={500}
        />
        <Image
          src="/genetic.gif"
          alt="Picture of Sara El-Shawa"
          width={500}
          height={500}
        />

    
      </div>
    </main>
  )
}
