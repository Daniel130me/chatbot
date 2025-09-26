import { useState, useEffect, useRef } from "react";
import ReactMarkdown from "react-markdown";
import './Home.css';

const Home = () => {
    const [input, setInput] = useState('');
    const [history, setHistory] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const chatContainerRef = useRef(null);

    const handleChange = (e) => {
        setInput(e.target.value);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!input.trim()) return;

        const userMessage = {
            role: "user",
            content: input,
        };

        const updatedHistory = [...history, userMessage];
        setHistory(updatedHistory);
        setInput('');
        setIsLoading(true);

        try {
            // const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
            //     method: "POST",
            //     headers: {
            //         "Authorization": `Bearer ${import.meta.env.VITE_API_KEY}`,
            //         "Content-Type": "application/json",
            //     },
            //     body: JSON.stringify({
            //         model: "gpt-3.5-turbo",
            //         messages: updatedHistory,
            //     }),
            // });
            let response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
                method: "POST",
                headers: {
                    "Authorization": `Bearer ${import.meta.env.VITE_API_KEY}`,
                    "HTTP-Referer": "node71.com",
                    "X-Title": "node71 limited",
                    "Content-Type": "application/json"
                },

                body: JSON.stringify({
                    model: "@preset/node71-chat",
                    messages: updatedHistory
                })

            });
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const data = await response.json();
            const modelMessage = data.choices[0].message;
            setHistory((prevHistory) => [...prevHistory, modelMessage]);
        } catch (error) {
            console.error("Error fetching data:", error);
            const errorMessage = {
                role: "model",
                content: "Sorry, something went wrong. Please try again.",
            };
            setHistory((prevHistory) => [...prevHistory, errorMessage]);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        if (chatContainerRef.current) {
            chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
        }
    }, [history]);

    return (
        <div className="chat-container">
            <div className="chat-history" ref={chatContainerRef}>
                {history.map((message, index) => (
                    <div key={index} className={`message ${message.role}`}>
                        <ReactMarkdown>{message.content}</ReactMarkdown>
                    </div>
                ))}
                {isLoading && (
                    <div className="message model">
                        <div className="loader"></div>
                    </div>
                )}
            </div>
            <form onSubmit={handleSubmit} className="chat-input-form">
                <textarea
                    rows={1}
                    onChange={handleChange}
                    value={input}
                    placeholder="Type your prompt here"
                    onKeyDown={(e) => {
                        if (e.key === 'Enter' && !e.shiftKey) {
                            e.preventDefault();
                            handleSubmit(e);
                        }
                    }}
                />
                <button type="submit" disabled={isLoading}>Send</button>
            </form>
        </div>
    );
};

export default Home;