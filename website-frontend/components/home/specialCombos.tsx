import React from 'react'

function SpecialCombos() {

    const comboData = [
        {
            id: 1,
            title: "Daily Essentials Kit",
            imgSrc: "https://placehold.co/400x323",
            altText: "Slide 1"
        },
        {
            id: 2,
            title: "Impeccable Matt Set of Three",
            imgSrc: "https://placehold.co/400x323",
            altText: "Slide 2"
        },
        {
            id: 3,
            title: "Fragrance Team Set",
            imgSrc: "https://placehold.co/400x323",
            altText: "Slide 3"
        },
    ]
    return (
        <div className='container mx-auto px-4 mb-5'>
            <div className='heading my-2.5 ownContainer text-center uppercase sm:my-10'>
                SPECIAL COMBOS
            </div>
            <div className='relative'>
                <div className='flex overflow-x-auto gap-5 sm:flex-wrap sm:justify-center scroll-smooth no-scrollbar'>
                    {comboData.map(combo => (
                        <div className='shrink-0 w-[80vw] sm:w-86.75'>
                            <img src={combo.imgSrc} alt={combo.altText} className='w-full h-auto object-cover' />
                            <p className='text-center uppercase textGa font-medium'>{combo.title}</p>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    )
}

export default SpecialCombos
