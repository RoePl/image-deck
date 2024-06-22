import { format, toKebabCase, toCamelCase, unzip, getUrl } from './utils/funcs';
import { URLConfig } from './utils/classes';

const inputConverter = format(toKebabCase);
const outputConverter = format(toCamelCase);

const pathMapper = new URLConfig({
    host: process.env.REACT_APP_SERVER_HOST,
    port: process.env.REACT_APP_SERVER_PORT
}, "/image-deck", inputConverter);

export default class Service {
    static admins = {
        async authorize({ email, password }) {
            const token = await fetch(
                pathMapper.toString("/admins/auth", { email, password }),
                { method: "GET" }
            ).then(res => {
                if (!res.ok) throw Error();

                return res.json()
            });

            localStorage.setItem("Authorization", token);
        }
    };

    static users = {
        async getAll() {
            const users = await fetch(
                pathMapper.toString("/users"),
                {
                    method: "GET",
                    headers: {
                        "Authorization": localStorage.getItem("Authorization")
                    }
                }
            ).then(res => res.json());

            return outputConverter(users);
        },
        async authenticate() {
            const userId = await fetch(
                pathMapper.toString("/users"),
                { method: "POST" }
            ).then(res => res.json());

            return userId;
        },
        async registerChoice(
            userId, { 
                imageCombination, 
                selectedImage 
            }
        ) {
            const choice = inputConverter({ 
                imageCombination, 
                selectedImage 
            });

            await fetch(
                pathMapper.toString(`/users/${userId}/choices`),
                {
                    method: "POST",
                    body: JSON.stringify(choice),
                    headers: { "Content-Type": "application/json" }
                }
            );
        }
    };

    static images = {
        async add(files) {
            const formData = new FormData();

            for (const item of files) {
                formData.append("new_images", item);
            }

            await fetch(
                pathMapper.toString("/images"),
                {
                    method: "POST",
                    headers: {
                        "Authorization": localStorage.getItem("Authorization")
                    },
                    body: formData
                }
            );
        },
        async getAll() {
            return unzip(() => fetch(
                pathMapper.toString("/images/all"),
                {
                    method: "GET",
                    headers: {
                        "Authorization": localStorage.getItem("Authorization")
                    }
                }
            ), getUrl);
        },
        async deleteById(imageId) {
            await fetch(
                pathMapper.toString(`/images/id/${imageId}`),
                {
                    method: "DELETE",
                    headers: {
                        "Authorization": localStorage.getItem("Authorization")
                    }
                }
            );
        },
        async getNextCombination(userId) {
            return unzip(() => fetch(
                pathMapper.toString(`/images/shuffled/${userId}/${
                    process.env.REACT_APP_COMBINATION_LENGTH
                }`),
                {
                    method: "GET",
                    headers: {
                        "Authorization": localStorage.getItem("Authorization")
                    }
                }
            ), getUrl);
        }
    };
};