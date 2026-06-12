import { useQuery } from "@tanstack/react-query";
import { TestimonialApi } from "../api/modules/testimonial";

export const useTestimonialsQuery = () => {
    return useQuery({
        queryKey: ["testimonials"],
        queryFn: TestimonialApi.getAll,
        staleTime: Infinity,
        refetchOnMount: false,
        refetchOnWindowFocus: false,
    });
};
