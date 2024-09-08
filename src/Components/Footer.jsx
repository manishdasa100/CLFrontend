import flagIndia from '../assets/FlagIndia.png';

const Footer = () => {
    return <div className="w-full bg-white border-t-1 border-stroke-gray/30">
        <div className="flex justify-between items-center px-64 py-3 text-xs text-text-gray">
            <div>Copyright &copy; 2024 Acecode</div>
            <div className='max-w-fit'><img src={flagIndia} className='w-4 inline'/> India</div>
        </div>
    </div>
}

export default Footer