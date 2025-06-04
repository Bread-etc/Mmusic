import ProgressBar from "./Dock/ProgressBar";
import TimeDisplay from "./Dock/TimeDisplay";

function Dock() {
    return (
        <div className="dock">
            底部栏Dock
            <ProgressBar />
            <TimeDisplay />
        </div>
    )
}

export default Dock;