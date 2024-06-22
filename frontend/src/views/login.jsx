import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { useForm } from "../hooks";
import Service from "../service";

export default function Login() {
    const { data, subscribe } = useForm();
    const navigate = useNavigate();
    const [areCredentialsValid, setCredentialsValid] = useState(true);

    useEffect(() => {
        if (!areCredentialsValid) setCredentialsValid(true);
    }, [data]);

    return (
        <>
            <input {...subscribe(data.email)} placeholder="Email" />
            <input {...subscribe(data.password)} placeholder="Password" />
            <button onClick={async () => {
                try{
                    await Service.admins.authorize(data.getValue());
                    navigate("/image-deck/controls/users");
                } catch (err) {
                    setCredentialsValid(false);
                }
            }} >Login</button>
            <br />
            <p style={{
                display: (areCredentialsValid ? "none" : "initial"),
                color: "red"
            }}>Email or password are incorrect</p>
        </>
    );
};