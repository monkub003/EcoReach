// This should be in a file named [username].js in the pages directory

import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';

export default function UserInfo() {
    const router = useRouter();
    const { username } = router.query; // Get username from router query params
    
    const [info, setInfo] = useState(null);
    const [infoList, setInfoList] = useState(null);
    const [error, setError] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    
    useEffect(() => {
        console.log("Router query:", router.query);
        console.log("Username value:", username);
        
        if (!username) {
            console.log("Username not available yet");
            return; // Wait until username is available after hydration
        }
        
        console.log("Fetching data for username:", username);
        
        const fetchData = async () => {
            try {
                // Use the full URL for debuggings
                const apiUrl = `http://127.0.0.1:3344/api/userinfo/${username}`;
                console.log("Fetching from:", apiUrl);
                
                const response = await fetch(apiUrl);
                console.log("Response status:", response.status);
                
                if (!response.ok) {
                    throw new Error(`Failed to fetch user data: ${response.status}`);
                }
                
                const data = await response.json();
                console.log("Received data:", data);
                
                setInfo(data);
                // Your API returns data directly, not inside a data property
                if (data) {
                    setInfoList(
                        Object.keys(data).map((key) => (
                            <li key={key}>
                                {key}: {data[key]}
                            </li>
                        ))
                    );
                } else {
                    console.error("Data format unexpected:", data);
                    setError("Received invalid data format from API");
                }
                setIsLoading(false);
            } catch (err) {
                console.error('Error fetching user info:', err);
                setError(`Failed to load user profile data: ${err.message}`);
                setIsLoading(false);
            }
        };
        
        fetchData();
    }, [username, router.query]);
    
    // Add some debug information in the UI
    if (error) return (
        <div>
            <p>Error: {error}</p>
            <p>Username from URL: {username}</p>
        </div>
    );
    
    if (isLoading || !info) return (
        <div>
            <p>Loading profile data for: {username || "unknown"}</p>
        </div>
    );
    
    return (
        <main className="flex min-h-screen flex-col items-center justify-between p-4">
            <div
                className="w-full flex flex-col justify-center items-center dark:drop-shadow-[0_0_0.3rem_#ffffff70]"
            >
                <h1 className="text-4xl mb-4">{info?.username || username} Info</h1>
                {infoList ? (
                    <ul className="list-disc pl-8">{infoList}</ul>
                ) : (
                    <p>No user information available</p>
                )}
            </div>
        </main>
    );
}