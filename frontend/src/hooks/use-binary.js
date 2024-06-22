import { useState, useEffect, useCallback } from 'react';
import { fileTypeFromBuffer } from 'file-type';
import JSZip from 'jszip';
import { Buffer } from 'buffer';
import { HashMap } from '../utils/classes';

export async function getUrl(buffer, encoding = 'base64') {
    const type = await fileTypeFromBuffer(buffer);
    const data = buffer.toString(encoding);

    const url = `data:${type.mime};${encoding},${data}`;

    return url;
};

export default function useBinary(
    supplier, dependencies = []
) {
    const [files, setFiles] = useState({});
    const [urls, setUrls] = useState({})

    const populate = useCallback(async () => {
        await supplier()
        .then(res => res.blob())
        .then(blob => blob.arrayBuffer())
        .then(arrayBuffer => Buffer.from(arrayBuffer))
        .then(async (buffer) => {
            setFiles({});
            setUrls({});
            
            const zip = new JSZip();

            try {
                const data = await zip.loadAsync(new Blob([buffer]));
    
                for (const [key, value] of Object.entries(data.files)) {
                    const file = await value.async("nodebuffer");
                    const url = await getUrl(file);
    
                    setFiles(prev => {
                        return {...prev, [key]: file}
                    });
    
                    setUrls(prev => {
                        return {...prev, [key]: url}
                    });
                }
            } catch (error) {
                return;
            }
        });
    }, dependencies);

    useEffect(() => {
        async function respond() {
            await populate();
        }

        respond();
    }, dependencies);

    return { 
        files: new HashMap(files), 
        urls: new HashMap(urls) 
    };
};