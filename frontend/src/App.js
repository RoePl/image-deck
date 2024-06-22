import "./App.css";
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Control, Login, Menu, Slide } from "./views";

function App() {
    return (
        <BrowserRouter>
            <Routes>
                <Route path="image-deck" >
                    <Route path="home" element={<Menu/>} />
                    <Route path="login" element={<Login />} />
                    <Route path="game/:userId" element={<Slide />} />
                    <Route path="controls" >
                        <Route path="gallery" />
                        <Route path="users" element={<Control />} />
                    </Route>
                </Route>
            </Routes>
        </BrowserRouter>
	);
}

export default App;
