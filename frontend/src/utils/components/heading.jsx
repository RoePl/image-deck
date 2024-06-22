import { useRef, useReducer, useEffect, cloneElement, Children } from "react";
import styled from "styled-components";

const Wrapper = styled.div`
display: flex;
align-items: stretch;
`;

const Separator = styled.hr`
height: auto;
margin: 0;
border: none;
`;

export default function Heading({ 
    children, 
    grid, 
    child, 
    onResize
}) {
    const [sizes, resize] = useReducer(
        (state, { index, value }) => {
            if (index > state.length - 1) {
                return [...state, value];
            } else return state.map((item, innerIndex) => (
                innerIndex === index 
                ? value : item
            ));
        }, []
    );

    useEffect(() => onResize(sizes), [sizes]);

    const resizeObserver = useRef(
        new ResizeObserver((entries) => {
            for (const entry of entries) {
                let elementWidth = 0;

                entry.borderBoxSize.forEach(
                    column => elementWidth += column.inlineSize
                );

                const resizeEvent = new CustomEvent(
                    "resize", {
                        detail: elementWidth
                    }
                );

                entry.target.dispatchEvent(resizeEvent);
            }
        }
    ));

    return (
        <Wrapper>
        {Children.map(children, (element, index) => (
            <>
            {(index > 0) && (<Separator key={`a-${index}`} style={grid}/>)}
            {cloneElement(element, {
                key: `b-${index}`,
                observer: resizeObserver.current,
                onResize: (width) => resize({ index, value: width }),
                style: {
                    ...(element.props.style ?? {}),
                    ...(child ?? {})
                }
            })}
            </>
        ))}
        </Wrapper>
    );
};