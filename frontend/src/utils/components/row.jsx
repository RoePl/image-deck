import { NestedContainer } from "../classes";
import { isSubClass } from "../funcs";
import { cloneElement } from "react";
import styled from "styled-components";

const Wrapper = styled.div`
display: flex;
flex-direction: row;
align-items: stretch;
height: fit-content;
`;

const Separator = styled.hr`
height: auto;
margin: 0;
border: none;
`;

export default class Row extends NestedContainer {
    countHorizontalChildren() {
        let leaves = 0;

        this.children().forEach((child, index) => {
            if (isSubClass(child.type, NestedContainer)) {
                const childRef = this.childRefs[index]

                leaves += childRef?.countHorizontalChildren() || 1;
            } else leaves++;
        });

        return leaves;
    }

    render() {
        let sizeCounter = 0;

        return (
            this.props.sizes &&
            <Wrapper>
            {this.children()?.map((child, index) => {
                let updatedChild = null;

                if (isSubClass(child.type, NestedContainer)) {
                    const capacity = this.countHorizontalChildren()
                    const ownSizes = this.props.sizes.slice(
                        sizeCounter, sizeCounter + capacity
                    );

                    sizeCounter += capacity;

                    updatedChild = cloneElement(child, {
                        sizes: ownSizes,
                        ref: (element) => this.setRef(element, index)
                    });
                } else {
                    const ownSize = this.props.sizes[sizeCounter];
                    const newstyle = this.props.child;

                    sizeCounter++;

                    updatedChild = this.injectProps(
                        child, ({ style }) => {
                            return {
                                key: `b-${index}`,
                                style: {
                                    ...(style ?? {}), 
                                    ...(newstyle ?? {}), 
                                    width: ownSize
                                }
                            };
                        }
                    );
                }

                return (
                    <>
                    {(index > 0) && (
                        <Separator 
                            style={this.props.grid} 
                            key={`a-${index}`}
                        />
                    )}
                    {updatedChild}
                    </>
                );
            })}
            </Wrapper>
        )
    }
};