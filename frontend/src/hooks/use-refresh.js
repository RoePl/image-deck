import { useState, useEffect, useRef, useCallback } from 'react';

export default function useRefresh(callback, dependencies = []) {
    const [binarySwitch, setSwitch] = useState(false);
    const storedArgs = useRef(undefined);
    const storedResult = useRef(undefined);
    
    const refresh = () => setSwitch(prev => !prev);
    const respond = useCallback(async () => {
        const recentResult = await callback(...storedArgs.current);

        storedResult.current = recentResult;
    }, dependencies);

    useEffect(() => {
        async function execute() {
            if (storedArgs.current !== undefined) await respond();
        }

        execute();
    }, [binarySwitch]);

    const trigger = (...args) => {
        storedArgs.current = args;

        refresh();

        return storedResult.current;
    };

    return [trigger, binarySwitch];
};