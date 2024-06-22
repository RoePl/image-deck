import { useRef, useEffect } from "react";
import styled from "styled-components";

const Wrapper = styled.div`
box-sizing: border-box;
border: none;
width: 100%;
`;

export default function Cell({ 
    onResize, 
    observer, 
    children, 
    ...rest 
}) {
    const domRef = useRef();

    useEffect(() => {
        const element = domRef.current;

        if (!element) return;
        if (!!observer) observer.observe(element);
        if (!!onResize) element.addEventListener(
            "resize", (e) => onResize(e.detail)
        );

        return () => {
            observer?.unobserve(element);
        }
    }, []);

    return <Wrapper 
        {...rest} 
        ref={domRef}
        >{children}</Wrapper>;
};