'use client'
import { useEffect } from "react";

const Component = () => {
    useEffect(() => {
        console.log('changed with pipeline hell ya');
        fetch(`/api/news`) // Relative URL
            .then(res => res.json())
            .then(data => {
                console.log('Parsed data:', data);
            })
            .catch(err => console.error('Fetch error:', err));
    }, []);

    return null;
}

export default Component