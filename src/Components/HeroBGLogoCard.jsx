const HeroBGLogoCard = ({identifier, iconLink, type}) => {

    const variantStyles = {
       lg:'size-7',
       sm:'size-4',
       default:'size-6' 
    }

    return <div className="px-3 py-3 rounded-lg border-r-1 border-b-1 border-[#8ea6c6]/[0.3] bg-gradient-to-br from-[#8ea6c6]/[0.2] to-[#7387A1]/[0.2] shadow-2xl backdrop-blur-sm animate-reverseSpin" style={{animationDuration:'60s'}}>
        <img src={iconLink} alt={identifier} className={`${variantStyles[type]?variantStyles[type]:variantStyles.default} drop-shadow-lg`}></img>
    </div>
}

export default HeroBGLogoCard