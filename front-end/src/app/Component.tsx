'use client'
import { useEffect, useState } from "react";

import axios from "axios";

const Component = () => {
    useEffect(() => {
        console.log('force pipeline with ecr another oness');
        fetch(`/api/news`) // Relative URL
            .then(res => res.json())
            .then(data => {
                console.log('Parsed data:', data);
            })
            .catch(err => console.error('Fetch error:', err));
    }, []);

    const [file, setFile] = useState()
    const [caption, setCaption] = useState("")

    const fileSelected = event => {
        const file = event.target.files[0]
        setFile(file)
    }
    const submit = async event => {
        event.preventDefault()

        const formData = new FormData();
        formData.append("image", file)
        formData.append("title", 'title')
        formData.append("description", caption)
        formData.append("country", 'country')

        await axios.post("/api/admin/products", formData,
            { headers: {'Content-Type': 'multipart/form-data', 'Authorization': 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwidXNlcm5hbWUiOiJhZG1pbnVzZXIiLCJyb2xlIjoiYWRtaW4iLCJpYXQiOjE3MzY4MDY1ODEsImV4cCI6MTczNjg5Mjk4MX0.OymkXK55iS3zUo8Bf0ySfcF-pnOrk4hrFpcUm-hylTg' }
            })
    }

    return <div>
        <form onSubmit={submit} style={{width:650}} className="flex flex-col space-y-5 px-5 py-14">
            <input onChange={fileSelected} type="file" accept="image/*"></input>
            <input value={caption} onChange={e => setCaption(e.target.value)} type="text" placeholder='Caption'></input>
            <button type="submit">Submit</button>
        </form>
    </div>;
}

export default Component