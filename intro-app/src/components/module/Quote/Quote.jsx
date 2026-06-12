import { Container } from "@components/ui"
import { testimonials } from "./../../../constants/sections.js";
import QuoteList from "./componnets/QuoteList/QuoteList.jsx";
import { useQuoteQuery } from "../../../hooks/useQuote.js";

import "./Quote.css";

const Quote = () => {
    const { data: quotes, isLoading, isError, error } = useQuoteQuery();


    return (
        <Container>
            <section className="quote">
                <QuoteList quotes={quotes} />
            </section>
        </Container>
    )
}

export default Quote;