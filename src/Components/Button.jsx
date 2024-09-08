function Button({text, variant}) {

    const variantStyles = {
        primary: 'bg-[#1b88ff] hover:bg-[#1075e3] text-[#ffffff] border-[#1159a8]',
        primary_bold:'bg-[#1b88ff] hover:bg-[#1075e3] text-[#ffffff] font-semibold border-[#5fabff]',
        success: '',
        danger: '',
        primary_outlined: 'border border-[#1b88ff] bg-transparent text-[#1b88ff]',
        primary_outlined_bold: 'border border-[#1b88ff] bg-transparent text-[#1b88ff] font-semibold',
        success_outlined: '',
        danger_outlined: ''
    };

    const baseStyles = 'px-4 py-2 rounded-xl w-fit cursor-pointer border-2'

    return <div className={`${baseStyles} ${variantStyles[variant]}`}>
        {text}
    </div>
}

export default Button