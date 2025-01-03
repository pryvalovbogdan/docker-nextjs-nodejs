'use client'
import { useEffect } from "react";


const Component = () => {
    useEffect(() => {
        fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}news`).then(res => {
            console.log('res', res)
            return res.json()
        }).then(res => {
            console.log('parsed', res)
        })
    }, []);

    return null;
}

export default Component