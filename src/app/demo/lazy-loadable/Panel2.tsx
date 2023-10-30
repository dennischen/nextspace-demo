
import json from "./3m.json"

export default function Panel1({}){
    return <div>
        Panel2 {JSON.stringify(json).length}
    </div>
}