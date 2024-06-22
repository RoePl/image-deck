import { Cell, Column, Row } from "../../../utils/components"
import styled from "styled-components"

const Image = styled.img`
object-fit: contain;
`;

export default function Choice({
    imageCombination,
    selecetedImage
}) {
    return (
        <Row child={{ padding: "10%" }}>
            <Column child={{ height: 150, padding: "10%" }}>
            {imageCombination.map((url, index) => (
                <Cell key={index}>
                    <Image src={url} />
                </Cell>
            ))}
            </Column>
            <Cell>
                <Image src={selecetedImage} />
            </Cell>
        </Row>
    )
};