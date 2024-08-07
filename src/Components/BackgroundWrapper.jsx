const BackgroundWrapper = ({children}) => {
    // return <div className='min-h-screen bg-gradient-to-br from-[#303a4a] to-[#0d111a] to-70%'>
    //     {children}
    // </div>
    return <div className='min-h-screen bg-[#05080E]'>
        {children}
    </div>
}

export default BackgroundWrapper;