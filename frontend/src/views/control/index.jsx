import styled from "styled-components";
import { useState, useEffect } from "react";
import { useAsync, useRefresh } from "../../hooks";
import { deepMatch } from "../../utils/funcs";
import Service from "../../service";
import { Table, Heading, Cell } from "../../utils/components";
import User from "./components/user";

export default function Control() {
    const [users, setUsers] = useState([]);
    const [urls, setUrls] = useState({});
    const [trigger, ] = useRefresh(() => undefined, []);

    useEffect(() => {
        Service.users.getAll()
        .then(setUsers);

        Service.images.getAll()
        .then(data => setUrls(data.dictionary));

        trigger();
    }, []);

    return (
        users && urls && 
        <Table
            heading={
                <Heading 
                    child={{ 
                        height: 50, 
                        backgroundColor: "#ababab" 
                    }}
                >
                    <Cell style={{ width: 120 }}>User ID</Cell>
                    <Cell style={{ width: 160 }}>Image Combinations</Cell>
                    <Cell style={{ width: 200 }}>Selected Images</Cell>
                </Heading>
            }
        >
            {users.map((user, index) => (
                <User 
                    data={user} 
                    images={urls} 
                    key={index} 
                />
            ))}
        </Table>
    );
};