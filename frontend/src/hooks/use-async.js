import { useEffect, useState } from "react";

export default function useAsync(callback, dependencies) {
    const [value, setValue] = useState(null);

    useEffect(() => {
        async function populateValue() {
            const result = await callback();

            setValue(result);
        }

        populateValue();
    }, dependencies);

    return value;
};