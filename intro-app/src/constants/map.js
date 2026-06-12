import {
    SlSocialGoogle,
    SlSocialInstagram,
    SlSocialLinkedin,
    SlSocialFacebook,
    SlSocialYoutube,
    SlSocialGithub,
    SlLocationPin
} from
    "react-icons/sl";
import { IoMailOutline } from "react-icons/io5";
import { FiPhone } from "react-icons/fi";
import { SiWhatsapp } from "react-icons/si";
import { BsTwitterX, BsDiscord, BsReddit, BsTwitch, BsTiktok } from "react-icons/bs"
import { AiOutlineAim } from "react-icons/ai";
import { FaPeopleRoof } from "react-icons/fa6";
import { LuSofa } from "react-icons/lu";
import { GiShower } from "react-icons/gi";
import { GiWifiRouter } from "react-icons/gi";
import { TbAirConditioning } from "react-icons/tb";
import { IoBedOutline } from "react-icons/io5";
import { FaTelegramPlane } from "react-icons/fa";


import { MdOutlineLight } from "react-icons/md";
import { LiaSwimmingPoolSolid } from "react-icons/lia";
import { CgGym } from "react-icons/cg";
import { RiParkingLine } from "react-icons/ri";
import { PiSecurityCamera } from "react-icons/pi";
import { GiPoolDive } from "react-icons/gi";
import { FaBtc } from "react-icons/fa";

export const ICON_MAP = {
    default: SlSocialGoogle,
    faBtc: FaBtc,
    aim: AiOutlineAim,
    google: SlSocialGoogle,
    location: SlLocationPin,
    email: IoMailOutline,
    phone: FiPhone,
    whatsapp: SiWhatsapp,
    twitter: BsTwitterX,
    facebook: SlSocialFacebook,
    instagram: SlSocialInstagram,
    linkedin: SlSocialLinkedin,
    youtube: SlSocialYoutube,
    github: SlSocialGithub,
    tiktok: BsTiktok,
    telegram: FaTelegramPlane,
    discord: BsDiscord,
    reddit: BsReddit,
    twitch: BsTwitch,

    people: FaPeopleRoof,
    sofa: LuSofa,
    bed: IoBedOutline,
    shower: GiShower,
    wifi: GiWifiRouter,
    conditioner: TbAirConditioning,

    light: MdOutlineLight,
    pool: LiaSwimmingPoolSolid,
    gym: CgGym,
    parking: RiParkingLine,
    security: PiSecurityCamera,
    swiming: GiPoolDive
};
