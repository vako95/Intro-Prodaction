import { Container } from "@components/ui";
import { useRef, useEffect, useState } from "react";
import PersonalContent from "./components/PersonalContent/PersonalContent.jsx";
import SkillsSection from "./components/SkillsSection/SkillsSection.jsx";
import SkillsDescription from "./components/SkillsDescription/SkillsDescription.jsx";
import PerosnalWrapper from "./components/PerosnalWrapper/PerosnalWrapper.jsx";
import { usePersonalDetailQuery } from "../../../../../hooks/usePersonal.js";
import { useBreadcrumbTitle } from "@/hooks/useBreadcrumbTitle";
import "./PersonalDetail.css";
import { useParams } from "react-router-dom";

const PersonalDetail = () => {
    const ref = useRef();
    const [visible, setVisible] = useState(false);
    const [progresses, setProgresses] = useState([]);

    const duration = 1500;
    const { slug } = useParams();
    const { data: member, isLoading, isError } = usePersonalDetailQuery(slug);
    
    const memberName = member ? `${member.first_name || ''} ${member.last_name || ''}`.trim() : null;
    useBreadcrumbTitle(memberName);


    useEffect(() => {
        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting) setVisible(true);
            },
            { threshold: 0.5 }
        );

        if (ref.current) observer.observe(ref.current);

        return () => observer.disconnect();
    }, [member]);

    useEffect(() => {
        if (!visible || !member?.skills?.length) return;
        let start = 0;
        const animate = (timestamp) => {
            if (!start) start = timestamp;
            const elapsed = timestamp - start;
            setProgresses(
                member.skills.map((skill) =>
                    Math.min(Math.floor((elapsed / duration) * skill.value), skill.value)
                )
            );
            if (elapsed < duration) requestAnimationFrame(animate);
        };
        requestAnimationFrame(animate);
    }, [visible, member?.skills]);

    return (
        <Container>
            <section className="personal__detail">
                <div className="personal__detail-area">
                    <PerosnalWrapper member={member} />
                    <PersonalContent member={member} />
                    <SkillsDescription member={member} />
                    {member?.skills && (
                        <SkillsSection ref={ref} skills={member.skills} progresses={progresses} visible={visible} />
                    )}
                </div>
            </section>
        </Container>
    );
};

export default PersonalDetail;
