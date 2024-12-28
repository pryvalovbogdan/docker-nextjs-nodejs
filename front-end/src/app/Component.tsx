'use client'
import {useEffect} from "react";


const Component = () => {
    useEffect(() => {
        setTimeout(() => {
            fetch('http://localhost:13000/api/news').then(res => {
                console.log('ress', res)
                return res.json()
            }).then(res => {
                console.log('res22', res)
            })
        }, 5000)
    }, []);

    return null;
}

export default Component