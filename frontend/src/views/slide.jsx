import { useParams } from 'react-router-dom';
import { useState } from 'react';
import { useBinary, useRefresh } from '../hooks';
import Service from '../service';

export default function Slide() {
    const { userId } = useParams();
    const [isFinished, setFinished] = useState(false);
    
    const [swipe, refreshState] = useRefresh(async (imageId, urls) => {
        await Service.users.registerChoice(
            userId, {
                imageCombination: urls.keys(),
                selectedImage: imageId
            }
        );
    }, [userId]);
        
    const { urls } = useBinary(async () => {
        return Service.images
        .getNextCombination(userId)
        .then(res => {
            if (!res.ok) setFinished(true);

            return res;
        });
    }, [userId, refreshState]);

    return (
        <>{
            isFinished 
            ? <div>Game Over</div> 
            : urls.map(
                (key, value) => <img 
                    src={value}
                    key={key}
                    onClick={() => swipe(key, urls)}
                    style={{
                        width: "20vw"
                    }}
                />
            )
        }</>
    )
};