'use client'
import { PiCityFill } from 'react-icons/pi';
import { FaMountain, FaLandmark, FaUtensils, FaCamera, FaShoppingBag } from "react-icons/fa";
import { TbBeach } from "react-icons/tb";
import { MdForest, MdSportsSoccer, MdSunny } from "react-icons/md";
import { GiPartyPopper } from "react-icons/gi";
import CategoryBox from './CategoryBox';
import { usePathname, useSearchParams } from 'next/navigation';

export const categories = [
    {
        label: 'City',
        icon: PiCityFill,
        description: 'Urban adventures, nightlife, and cultural hubs.'
    },
    {
        label: 'Mountains',
        icon: FaMountain,
        description: 'Hiking, skiing, and high-altitude adventures.'
    },
    {
        label: 'Beach & Islands',
        icon: TbBeach,
        description: 'Relaxing beaches, tropical islands, and coastal getaways'
    },
    {
        label: 'Nature & Parks',
        icon: MdForest,
        description: 'National parks, forests, canyons, waterfalls, and scenic landscapes.'
    },
    {
        label: 'Food & Drink',
        icon: FaUtensils,
        description: 'Iconic food spots, coffee shops, wineries, and street markets.'
    },
    {
        label: 'Shopping',
        icon: FaShoppingBag,
        description: 'Shopping districts, local markets, and artisan shops.'
    },
    {
        label: 'Festivals',
        icon: GiPartyPopper,
        description: 'Music festivals, local traditions, and celebrations.'
    },
    {
        label: 'Sport Events',
        icon: MdSportsSoccer,
        description: 'Stadiums, race tracks, and major sports events.'
    },
    {
        label: 'Photo Spot',
        icon: FaCamera,
        description: 'Favourite spot for capturing scenic views and cityscapes.'
    },
    {
        label: 'Sunset Spot',
        icon: MdSunny,
        description: 'Favourite spot for viewing the sunset.'
    },
    {
        label: 'Landmarks',
        icon: FaLandmark,
        description: 'Famous landmarks, ancient ruins, and historical sites.'
    },
]

const Categories = () => {
    const params = useSearchParams();
    const category = params?.get('category');
    const pathname = usePathname();

    const isMainPage = pathname === '/map';
    if (!isMainPage) {
        return null;
    }

    return (
        <div className="pt-4 flex flex-row items-center justify-between overflow-x-auto">
            {categories.map((item) => (
                <CategoryBox
                   key={item.label}
                   label={item.label}
                   selected={category === item.label}
                   icon={item.icon}
                />
            ))}
        </div>
    );
}

export default Categories; 