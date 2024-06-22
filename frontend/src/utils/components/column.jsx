import { NestedContainer } from "../classes";
import { isSubClass } from "../funcs";
import { cloneElement } from "react";
import styled from "styled-components";

const Wrapper = styled.div`
display: flex;
flex-direction: column;
`;

const Separator = styled.hr`
height: 100%;
margin: 0;
border: none;
`;

export default class Column extends NestedContainer {
    countHorizontalChildren() {
        for (const [index, child] of Object.entries(this.children())) {
            if (isSubClass(child.type, NestedContainer)) {
                const childRef = this.childRefs[Number(index)];

                if (!!childRef) return childRef.countHorizontalChildren();
            }
        }

        return 0;
    }

    render() {
        const newStyle = this.props.child;

        return (
            <Wrapper>{this.children().map((child, index) => {
                return (
                    <>
                    {(index > 0) && (<Separator key={`a-${index}`} style={{
                        ...(this.props.grid ?? {}),
                        height: this.props.grid?.width,
                        width: this.props.grid?.height
                    }} />)}
                    {
                        isSubClass(child.type, NestedContainer) 
                        ? cloneElement(child, { 
                            sizes: this.props.sizes, 
                            ref: (element) => this.setRef(element, index), 
                            key: `b-${index}` 
                        }) 
                        : this.injectProps(child, ({ style }) => {
                            return {
                                key: `b-${index}`,
                                style: {
                                    ...(style ?? {}), 
                                    ...(newStyle ?? {})
                                }
                            };
                        })
                    }
                    </>
                )
            })}</Wrapper>
        );
    }
}