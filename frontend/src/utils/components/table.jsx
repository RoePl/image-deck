import { useState, Children, cloneElement } from "react";
import styled from "styled-components";

const Wrapper = styled.div`
display: flex;
flex-direction: column;
width: fit-content;
height: fit-content;
`;

const Separator = styled.hr`
height: 100%;
margin: 0;
border: none;
`;

export default function Table({ heading, grid, children }) {
    const [sizes, setSizes] = useState([]);

    return (
        <Wrapper>
            {cloneElement(heading, { onResize: setSizes })}
            {Children.toArray(children).map((child, index) => (
                <>
                {(!!heading || index > 0) && (<Separator key={`a-${index}`} style={{
                    ...(grid ?? {}),
                    height: grid?.width,
                    width: grid?.height
                }} />)}
                {cloneElement(child, { sizes, key: `b-${index}` })}
                </>
            ))}
        </Wrapper>
    )
};