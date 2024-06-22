import { useState } from 'react';
import { DeepProxy } from '../utils/classes';

export default function useForm(init) {
    const [data, setData] = useState(new DeepProxy(init));

    function subscribe(attributeProxy) {
        return {
            value: attributeProxy.getValue(),
            onChange: (event) => {
                setData(prev => {
                    attributeProxy.setValue(event.target.value);

                    return prev.clone();
                });
            }
        }
    }

    return { data, subscribe };
};