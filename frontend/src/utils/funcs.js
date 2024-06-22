import JSZip from 'jszip';
import { Buffer } from 'buffer';
import { fileTypeFromBuffer } from 'file-type';
import { HashMap } from '../utils/classes';

function isDict(obj) {
    return (
        obj !== null | undefined
        && typeof obj === 'object'
        && !Array.isArray(obj) 
    );
}

export function format(converter) {
    return function renameKeys(obj) {
        if (isDict(obj)) {
            let copy = {};

            for (const [key, value] of Object.entries(obj)) {
                copy[converter(key)] = renameKeys(value);
            }

            return copy;
        } 
        else if (Array.isArray(obj)) {
            return obj.map(renameKeys);
        }

        return obj;
    }
};

export function toCamelCase(sequence) {
    let words = sequence.split('_');
    
    words = words.map((value, index) => {
        if (index > 0) {
            return (
                value.charAt(0).toUpperCase() 
                + value.slice(1).toLowerCase()
            );
        } else return value.toLowerCase();
    });

    return words.join('');
};

export function toKebabCase(sequence) {
    const words = [''];

    for (let char of sequence) {
        if (char.toUpperCase() === char) {
            words.push(char.toLowerCase());
        } else {
            words[words.length - 1] += char;
        }
    }

    return words.join('_');
};

export function getDeepItem(obj, path) {
    const attributes = path.split('.');

    const root = attributes[0];
    const tail = attributes.slice(1).join('.');

    if (attributes.length > 1) {
        if (obj[root] === null | undefined) obj[root] = {};

        return getDeepItem(obj[root], tail);
    } else {
        if (root === '') return obj;

        return obj[root];
    }
};

export function setDeepItem(obj, path, value) {
    const attributes = (
        Array.isArray(path) 
        ? [...path] 
        : path.split('.')
    );
    
    if (Array.isArray(obj) && value instanceof Function) {
        for (let index = 0; index < obj.length; index++) {
            const item = obj[index];
            
            if (isDict(item) || Array.isArray(item)) setDeepItem(item, attributes, value);
            else obj[index] = value(item);
        }
    }
            
    if (attributes.length === 0) return;

    const [root, ...tail] = attributes;

    if (isDict(obj)) {
        const property = obj[root];
    
        if (Array.isArray(property)) {
            setDeepItem(property, tail, value);
        } else {
            if (tail.length > 0) {
                if (property === null | undefined) {
                    obj[root] = {};
                }
    
                setDeepItem(obj[root], tail, value);
            } else {
                obj[root] = (
                    value instanceof Function 
                    ? value(property) 
                    : value
                );
            }
        }
        
    }
};

export function deepMatch(obj, dict, paths) {
    paths.forEach(path => setDeepItem(obj, path, (key) => dict[key]));
};
    
function getClassOf(obj) {
    return Object.getPrototypeOf(obj).constructor;
}

export function isSubClass(child, parent) {
    return (child.prototype instanceof parent) || (child === parent);
}

export function getOwnMethods(obj) {
    let methods = {};
    const prototype = Object.getPrototypeOf(obj);

    Object.getOwnPropertyNames(prototype)
    .forEach((key) => {
        const property = prototype[key];

        if (getClassOf(property) === Function) {
            let boundMethod = property.bind(obj);

            methods[key] = boundMethod;
        }
    });

    return methods;
};

export function getOwnProperties(obj) {
    let properties = {};

    Object.entries(obj).forEach(([key, value]) => properties[key] = value);

    return properties;
};

export async function unzip(streamSupplier, transform) {
    return await (
        streamSupplier()
        .then(res => res.blob())
        .then(blob => blob.arrayBuffer())
        .then(arrayBuffer => Buffer.from(arrayBuffer))
        .then(async (buffer) => {
            const zip = new JSZip();
            let result = new HashMap();

            try {
                const data = await zip.loadAsync(new Blob([buffer]));
    
                for (const [key, value] of Object.entries(data.files)) {
                    let item = await value.async("nodebuffer");

                    if (transform) {
                        item = await transform(item);
                    }

                    result.setItem(key, item);
                }
            } catch (error) {}

            return result;
        })
    );
}

export async function getUrl(buffer, encoding = 'base64') {
    const type = await fileTypeFromBuffer(buffer);
    const data = buffer.toString(encoding);

    const url = `data:${type.mime};${encoding},${data}`;

    return url;
};