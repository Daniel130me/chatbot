import { useState } from "react"
import ReactMArkdown from "react-markdown";
const Home = () => {
    const [input, setInput] = useState('')
    const [data, setData] = useState('')
    const [history, setHistory] = useState([])
    const handleChange = (e) => {
        setInput(e.target.value)
    }
    // allmessages = {
    //     role: "user",
    //     contemt: "what is life",

    //     model: "life is impossnce o c",
    //     content: "life s impssie  i",

    //     role: "user",
    //     content: "how did you nw"
    // }
    const handleSubmit = async (e) => {
        e.preventDefault()
        console.log("my form")
        const themessage = {
            "role": "user",
            "content": input
        }
        let updatedhistory = [...history, themessage];
        setHistory([...history, themessage])
        let response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
            method: "POST",
            headers: {
                "Authorization": "Bearer <token>",
                "HTTP-Referer": "node71.com",
                "X-Title": "node 71 limited",
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                model: "@preset/node71-chat",
                messages: updatedhistory
            })

        });

        let thedata = await response.json()
        console.log(thedata)
        setData(thedata.choices[0].message.content)
        setHistory((previousdata) => ([...previousdata, thedata.choices[0].message]))
    }

    return (
        <>
            <h1>Our AI project</h1>
            <form onSubmit={handleSubmit}>
                <input type="text" onChange={handleChange} value={input} placeholder="type your prompt here" />
                <button type="submit">Send</button>
            </form>
            <div><ReactMArkdown>{data}</ReactMArkdown></div>
        </>
    )
}

export default Home;