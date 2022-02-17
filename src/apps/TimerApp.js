import React from 'react';

import './TimerApp.css';

const FOCUS_DURATION = 25;
const SMALL_BREAK_DURATION = 5;
const LARGE_BREAK_DURATION = 15;

class TimerApp extends React.Component {
    constructor(props) {
        super(props);
        this.toggleTimer = this.toggleTimer.bind(this);
        this.startTimer = this.startTimer.bind(this);
        this.stopTimer = this.stopTimer.bind(this);
        this.tick = this.tick.bind(this);

        this.state = {
            timeRemaining: FOCUS_DURATION * 60,
            tomatoCount: 0,
            state: 'focus pause',
            flavorText: 'Time to focus!',
            timer: null,
        }
    }

    startTimer() {
        this.setState({
            timer: window.setTimeout(() => {
                this.tick();
                this.startTimer();
            }, 1000),
        });
    }

    stopTimer() {
        if (!this.state.timer) { return; }

        window.clearTimeout(this.state.timer);
        this.setState({
            timer: null,
        });
    }

    toggleTimer() {
        if (this.state.state === 'focus') {
            this.setState({
                state: 'focus pause',
            }, () => this.stopTimer());
        } else if (this.state.state === 'focus pause') {
            this.setState({
                state: 'focus',
            }, () => this.startTimer());
        }
    }

    tick() {
        // TODO: update time remaining
        console.log('tick');
    }

    componentWillUnmount() {
        this.stopTimer();
    }

    render() {
        let timerToggle = <button onClick={this.toggleTimer}>START</button>;

        if (this.state.state === 'focus' || this.state.state === 'break') {
            timerToggle = <button onClick={this.toggleTimer}>STOP</button>;
        }

        // TODO: update display to match time remaining
        return (
            <div className='TimerApp'>
                <h1>00:00</h1>
                { timerToggle }
            </div>
        );
    }
}

export default TimerApp;
