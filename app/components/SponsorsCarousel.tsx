'use client';
import React from 'react';
import Image from 'next/image';
import '../globals.css';

export default function SponsorsCarousel() {
    const sponsors = ['/sponsor1.png','/sponsor2.png','/sponsor3.png','/sponsor4.png'];
    return (
        <div className='sponsors-carousel'>
            {sponsors.map((src, idx) => (
                <div key={idx} className='sponsor'>
                    <Image src={src} alt={'Sponsor ' + (idx+1)} width={150} height={100} />
                </div>
            ))}
        </div>
    );
}
