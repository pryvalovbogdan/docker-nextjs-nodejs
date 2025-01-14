'use client';
import { ChangeEvent, FormEvent, useEffect, useState } from "react";
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

    const [file, setFile] = useState<File[] | null>(null);
    const [caption, setCaption] = useState("");

    const fileSelected = (event: ChangeEvent<HTMLInputElement>) => {
        setFile(Array.from(event.target.files));
    };

    const submit = async (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();


        if (!file || file.length === 0) {
            console.error("No file selected");
            return;
        }

        const formData = new FormData();

        file.forEach((f) => formData.append("image", f));

        formData.append("title", 'title');
        formData.append("description", caption);
        formData.append("country", 'country');

        try {
            await axios.post("/api/admin/products", formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                    'Authorization': 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwidXNlcm5hbWUiOiJhZG1pbnVzZXIiLCJyb2xlIjoiYWRtaW4iLCJpYXQiOjE3MzY4MDY1ODEsImV4cCI6MTczNjg5Mjk4MX0.OymkXK55iS3zUo8Bf0ySfcF-pnOrk4hrFpcUm-hylTg',
                },
            });
        } catch (error) {
            console.error("Error submitting form:", error);
        }
    };

    return (
        <div>
            <form
                onSubmit={submit}
                style={{ width: 650 }}
                className="flex flex-col space-y-5 px-5 py-14"
                encType="multipart/form-data"
            >
                <input
                    onChange={fileSelected}
                    type="file"
                    accept="image/*"
                    multiple
                />
                <input
                    value={caption}
                    onChange={(e: ChangeEvent<HTMLInputElement>) =>
                        setCaption(e.target.value)
                    }
                    type="text"
                    placeholder="Caption"
                />
                <button type="submit">Submit</button>
            </form>
        </div>
    );
};

export default Component;
