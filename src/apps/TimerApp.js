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
                const shouldTick = this.tick();
                if (shouldTick) { this.startTimer() }
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
            }, this.stopTimer);
        } else if (this.state.state === 'focus pause') {
            this.setState({
                state: 'focus',
            }, this.startTimer);
        } if (this.state.state === 'break') {
            this.setState({
                state: 'break pause',
            }, this.stopTimer);
        } else if (this.state.state === 'break pause') {
            this.setState({
                state: 'break',
            }, this.startTimer);
        }
    }

    tick() {
        if (this.state.timeRemaining > 1) {
            this.setState({
                timeRemaining: this.state.timeRemaining - 1,
            });
            return true;
        } else {
            if (this.state.state === 'break') {
                this.setState({
                    state: 'focus pause',
                    timeRemaining: FOCUS_DURATION * 60,
                    flavorText: 'Time to focus!',
                });
            } else if (this.state.state === 'focus') {
                const tomatoCount = this.state.tomatoCount + 1;
                if (tomatoCount % 4 === 0) {
                    this.setState({
                        state: 'break pause',
                        tomatoCount,
                        timeRemaining: LARGE_BREAK_DURATION * 60,
                        flavorText: 'Large break! You earned it!',
                    });
                } else {
                    this.setState({
                        state: 'break pause',
                        tomatoCount,
                        timeRemaining: SMALL_BREAK_DURATION * 60,
                        flavorText: 'Small break!',
                    });
                }
            }
            return false;
        }
    }

    componentWillUnmount() {
        this.stopTimer();
    }

    render() {
        let timerToggle = <button onClick={this.toggleTimer}>START</button>;

        const mins = toDoubleDigits(Math.floor(this.state.timeRemaining / 60));
        const secs = toDoubleDigits(this.state.timeRemaining % 60);
        const timeString = `${mins}:${secs}`;

        if (this.state.state === 'focus' || this.state.state === 'break') {
            timerToggle = <button onClick={this.toggleTimer}>STOP</button>;
            document.title = `${timeString} - Productivity Zone`;
        } else {
            document.title = 'Productivity Zone';
        }

        return !this.props.visible? null: (
            <div className='TimerApp'>
                <h1>{timeString}</h1>
                <h2>{this.state.flavorText}</h2>
                <p>Tomato count: {this.state.tomatoCount}</p>
                { timerToggle }
            </div>
        );
    }
}

// --- Functions ---
function toDoubleDigits(n) {
    const twoPlusDigits = (n).toLocaleString('en-US',
        { minimumIntegerDigits: 2, useGrouping: false });
    const result = twoPlusDigits.slice(-2);

    return result;
}

export default TimerApp;
