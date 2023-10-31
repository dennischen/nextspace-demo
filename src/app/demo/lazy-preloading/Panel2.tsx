
import json from "./3m.json"

export default function Panel1({}){
    return <div>
        Panel2 {JSON.stringify(json).length} loaded
        <br/>
        You saw a blank loading page before it loaded.
    </div>
}