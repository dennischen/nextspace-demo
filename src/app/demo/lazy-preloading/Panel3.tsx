
import json from "./3m.json"

export default function Panel1({}){
    return <div>
        Panel3 {JSON.stringify(json).length} loaded.
        <br/>
        You saw a loading indicator if viewing in slow network
    </div>
}