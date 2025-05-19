import bg01 from '@/assets/images/jiujiang/bg/bg_01.jpg';
import bg02 from '@/assets/images/jiujiang/bg/bg_02.jpg';
import bg03 from '@/assets/images/jiujiang/bg/bg_03.jpg';
import bg04 from '@/assets/images/jiujiang/bg/bg_04.jpg';
import bg05 from '@/assets/images/jiujiang/bg/bg_05.jpg';
import bg06 from '@/assets/images/jiujiang/bg/bg_06.jpg';
import bg07 from '@/assets/images/jiujiang/bg/bg_07.jpg';

// 定义背景图片项接口，与BScroll.vue中的定义保持一致
export interface BackgroundImageItem {
  url: string;
  opacity?: number;
  parallaxFactor?: number;
  zIndex?: number;
}

export const bgImages: BackgroundImageItem[] = [
    { url: bg01, opacity: 1 },
    { url: bg02, opacity: 1 },
    { url: bg03, opacity: 1 },
    { url: bg04, opacity: 1 },
    { url: bg05, opacity: 1 },
    { url: bg06, opacity: 1 },
    { url: bg07, opacity: 1 }
];


import zero01 from '@/assets/images/jiujiang/0-0.png';
import zer002 from '@/assets/images/jiujiang/0-1.png';

import one01 from '@/assets/images/jiujiang/1-0.png';
import one02 from '@/assets/images/jiujiang/1-1.png';
import one03 from '@/assets/images/jiujiang/1-2.png';
import one04 from '@/assets/images/jiujiang/1-3.png';
import one05 from '@/assets/images/jiujiang/1-4.png';

import two01 from '@/assets/images/jiujiang/2-0.png';
import two02 from '@/assets/images/jiujiang/2-1.png';

import three01 from '@/assets/images/jiujiang/3-0.png';
import three02 from '@/assets/images/jiujiang/3-1.png';
import three03 from '@/assets/images/jiujiang/3-2.png';
import three04 from '@/assets/images/jiujiang/3-3.png';
import three05 from '@/assets/images/jiujiang/3-4.png';
import three06 from '@/assets/images/jiujiang/3-5.png';

import four01 from '@/assets/images/jiujiang/4-0.png';
import four02 from '@/assets/images/jiujiang/4-1.png';
import four03 from '@/assets/images/jiujiang/4-2.png';

import five01 from '@/assets/images/jiujiang/5-0.png';
import five02 from '@/assets/images/jiujiang/5-1.png';

import six01 from '@/assets/images/jiujiang/6-0.png';
import person from '@/assets/images/jiujiang/person.gif';

export interface ImageItem {
    src: string;
    name: string;
    className: string[];
}

export const imageList: ImageItem[] = [
    { src: zero01, name: '0-0', className: ['zero-0', 'animate__fadeInDown', 'animate__slow'] },
    { src: zer002, name: '0-1', className: ['zero-1', 'animate__zoomIn'] },
    { src: one01, name: '1-0', className: ['one-0', 'animate__fadeInLeft'] },
    { src: one02, name: '1-1', className: ['one-1', 'animate__slideInUp', 'animate__slow'] },
    { src: one03, name: '1-2', className: ['one-2', 'animate__rotateInDownLeft'] },
    { src: one04, name: '1-3', className: ['one-3', 'animate__fadeInRight'] },
    { src: one05, name: '1-4', className: ['one-4', 'animate__bounceIn'] },
    { src: two01, name: '2-0', className: ['two-0', 'animate__flipInX'] },
    { src: two02, name: '2-1', className: ['two-1', 'animate__zoomInUp'] },
    { src: three01, name: '3-0', className: ['three-0', 'animate__slideInDown'] },
    { src: three02, name: '3-1', className: ['three-1', 'animate__fadeInRight', 'animate__slow'] },
    { src: three03, name: '3-2', className: ['three-2', 'animate__backInUp'] },
    { src: three04, name: '3-3', className: ['three-3', 'animate__rotateIn'] },
    { src: three05, name: '3-4', className: ['three-4', 'animate__jackInTheBox'] },
    { src: three06, name: '3-5', className: ['three-5', 'animate__lightSpeedInRight'] },
    { src: four01, name: '4-0', className: ['four-0', 'animate__bounceInDown'] },
    { src: four02, name: '4-1', className: ['four-1', 'animate__flipInY', 'animate__slow'] },
    { src: four03, name: '4-2', className: ['four-2', 'animate__rollIn'] },
    { src: five01, name: '5-0', className: ['five-0', 'animate__zoomInDown'] },
    { src: five02, name: '5-1', className: ['five-1', 'animate__backInDown'] },
    { src: six01, name: '6-0', className: ['six-0', 'animate__bounceInUp']}
]














