import { useNavigate } from 'react-router-dom';
import Service from '../service';

export default function Menu() {
    const navigate = useNavigate();

    return (
        <>
            <button
                onClick={async () => {
                    const userId = await Service.users.authenticate();

                    navigate(`/image-deck/game/${userId}`);
                }}
            >Start a New Game</button>
            <button 
                onClick={() => navigate("/image-deck/login")}
            >Login As an Administrator</button>
        </>
    );
};