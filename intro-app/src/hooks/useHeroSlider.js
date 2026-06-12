import { useQuery } from "@tanstack/react-query";
import { SliderHeroAPI } from "../api/modules/hero_slider.js";


export const useHeroSliderQuery = () => {
    return useQuery({
        queryKey: ["hero_slider"],
        queryFn: SliderHeroAPI.getAll,
        staleTime: Infinity,
        refetchOnMount: false,
        refetchOnWindowFocus: false,
    })
}