import { Cell, Column, Row } from "../../../utils/components"
import Choice from "./choice";

export default function User({ data, images }) {
    const matchUrl = (id) => images[id];

    return (
        <Row>
            <Cell>{data.id}</Cell>
            <Column>
            {data.choices.map((choice, index) => (
                <Choice 
                    imageCombination={choice.imageCombination.map(matchUrl)} 
                    selecetedImage={matchUrl(choice.selecetedImage)} 
                    key={index} 
                />
            ))}
            </Column>
        </Row>
    );
};