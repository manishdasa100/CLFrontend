// src/components/ConcentricRings.js
import React from 'react';
import HeroBGLogoCard from './HeroBGLogoCard';
import GoogleIcon from '../assets/iconGoogle.svg'
import MetaIcon from '../assets/iconMeta.svg'
import AmazonIcon from '../assets/iconAmazon.svg'
import AtlasianIcon from '../assets/iconAtlasian.svg'

const HeroBackground = () => {
  return (
    <div className='relative w-full h-[calc(850px-150px)] flex justify-center items-center bg-transparent'>
          {/* <div className='absolute rounded-full border h-[150px] w-[150px] border-[#00E89B]/20'></div> */}
          <div className='absolute rounded-full w-min h-min bg-gradient-to-b from-[#00E89B]/[0.04] from-10% to-transparent'>
            <div className='rounded-full h-[250px] w-[250px] animate-spin'></div>
          </div>
          {/* <div className="absolute rounded-full border h-[350px] w-[350px] border-[#8ea6c6]/[0.09]"></div> */}
          <div className='absolute rounded-full w-min h-min bg-gradient-to-b from-[#00E89B]/[0.04] from-10% to-transparent'>
            <div className="rounded-full h-[450px] w-[450px] animate-spin" style={{animationDuration:'60s'}}>
                <div className="absolute top-[47.7px] left-[47.48px] flex flex-col items-center">
                    <HeroBGLogoCard identifier="Google icon" iconLink={GoogleIcon}/>
                </div>
                <div className="absolute top-[47.7px] right-[47.48px] flex flex-col items-center">
                    <HeroBGLogoCard identifier="Meta icon" iconLink={MetaIcon} type='sm'/>
                </div>
            </div>
          </div>
          {/* <div className="absolute rounded-full border h-[550px] w-[550px] border-[#8ea6c6]/[0.07] animate-spin" style={{animationDuration:'40s'}}>
              <div className="absolute top-[65.3px] right-[62.3px] flex flex-col items-center">
                  <HeroBGLogoCard identifier="Meta icon" iconLink={MetaIcon} type='sm'/>
              </div>
               <div className="absolute bottom-[65.3px] left-[62.3px] flex flex-col items-center">
                  <HeroBGLogoCard identifier="Amazon Icon" iconLink={AmazonIcon} type='sm'/>
              </div>
          </div> */}
          <div className='absolute rounded-full w-min h-min bg-gradient-to-b from-[#00E89B]/[0.04] from-10% to-transparent'>
            <div className="rounded-full h-[650px] w-[650px] animate-spin" style={{animationDuration:'60s'}}>
                <div className="absolute bottom-[76.6px] right-[76.9px] flex flex-col items-center">
                    <HeroBGLogoCard identifier="Atlasian Icon" iconLink={AtlasianIcon}/>
                </div>
                <div className="absolute bottom-[76.6px] left-[76.6px] flex flex-col items-center">
                    <HeroBGLogoCard identifier="Amazon Icon" iconLink={AmazonIcon} type='sm'/>
                </div>
            </div>
          </div>
          {/* <div className="absolute rounded-full border h-[750px] w-[750px] border-[#8ea6c6]/[0.05]"></div> */}
          <div className='absolute rounded-full w-min h-min bg-gradient-to-b from-[#00E89B]/[0.04] from-10% to-transparent'>
            <div className="rounded-full h-[850px] w-[850px] animate-spin"></div>
          </div>
          <div className='absolute rounded-full w-min h-min bg-gradient-to-b from-[#00E89B]/[0.04] from-10% to-transparent'>
            <div className="rounded-full h-[1050px] w-[1050px] animate-spin"></div>
          </div>
    </div>
  );
};

export default HeroBackground;
