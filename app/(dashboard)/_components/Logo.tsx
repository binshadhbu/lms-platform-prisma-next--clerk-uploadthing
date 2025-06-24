import Image from 'next/image'
import React from 'react'

const Logo = () => {
  return (
    <div>
        <Image height={70} width={70} alt='logo' src={'/images/logo.svg'} />
    </div>
  )
}

export default Logo

