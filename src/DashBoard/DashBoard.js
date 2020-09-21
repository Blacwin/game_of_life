import React from 'react'

const DashBoard = props => {
    return (
        <div className="dashboard">
            <button onClick={props.start} disabled={props.isOn}>Start</button>
            <button onClick={props.stop} disabled={!props.isOn}>Stop</button>
            <input type="range" min="100" max="1000" step="100" disabled={props.isOn}
                defaultValue={props.frameRate} 
                onChange={props.setSpeed}
            />
        </div>
    )
}

export default DashBoard;