'use client'
import React from 'react'
import sc1 from './../../../assets/landing_animation/Screenshot 2024-09-21 224137.png';
import sc2 from './../../../assets/landing_animation/Screenshot 2024-09-21 224339.png';
import sc3 from './../../../assets/landing_animation/Screenshot 2024-09-21 224404.png';
import sc4 from './../../../assets/landing_animation/Screenshot 2024-09-21 224413.png';
import sc5 from './../../../assets/landing_animation/Screenshot 2024-09-21 224420.png';
import Image from 'next/image';
import "./styles.css"
import logo from './../../../assets/Ne/svg/logo-no-background.svg';
export default function LandingAnimation() {
    return (
        <div className="w-full h-screen overflow-auto relative hide-scroll">
            <Image src={sc1} alt="Document 1" height={650} width={400} className='transition-transform shadow-2xl img1' />
            <Image src={sc2} alt="Document 2" height={650} width={400} className='transition-transform shadow-2xl img2' />
            <Image src={sc3} alt="Document 3" height={650} width={400} className='transition-transform shadow-2xl img3' />
            <Image src={sc4} alt="Document 4" height={650} width={400} className='transition-transform shadow-2xl img4' />
            <Image src={sc5} alt="Document 5" height={650} width={400} className='transition-transform shadow-2xl img5' />
            <Image src={logo} className='transition-transform logo ' height={400} width={400} alt="DocAI Logo" />
        </div>
    )
}
