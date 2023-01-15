import moment from 'moment';

const convertMinsToHrsMins = (mins: number) => {
    let h: string | number = Math.floor(mins / 60);
    let m: string | number = mins % 60;
    h = h < 10 ? '0' + h : h; // (or alternatively) h = String(h).padStart(2, '0')
    m = m < 10 ? '0' + m : m; // (or alternatively) m = String(m).padStart(2, '0')
    return `${h}h${m}`;
}

function readableDate(timestamp: number) {
    if (timestamp === 0) return "N/A";
    const date = new Date(timestamp);
    const day = date.getDate();
    const month = date.getMonth() + 1;
    const year = date.getFullYear();
    const hour = date.getHours();
    const minutes = date.getMinutes();
    return `${day}/${month}/${year} ${hour}:${minutes}`;
}

function countdownDate(start: number, end: number, current: number, openCountdown: boolean): string {
    moment.locale("en-gb");
    const now = moment(current);
    const startMoment = moment(start);
    const endMoment = moment(end);
    let moreThan3Days = false;
    let moreThan1Day = false;
    let moreThan1Hour = false;
    let duration
    openCountdown ? duration = moment.duration(startMoment.diff(now)) : duration = moment.duration(endMoment.diff(now));
    if (duration.asHours() >= 24) {
        if (duration.asDays() >= 3) {
            moreThan3Days = true;
        } else {
            moreThan1Day = true;
        }
    } else if (duration.asHours() >= 1) {
        moreThan1Hour = true;
    }

    if (moreThan3Days) {
        if (openCountdown) {
            return "the " + startMoment.format("L") + " at " + startMoment.format("LT");
        } else {
            return "the " + endMoment.format("L") + " at " + endMoment.format("LT");
        }
    } else if (moreThan1Day) {
        return "in " + duration.days() + " days, " + duration.hours() + " hours and " + duration.minutes() + " minutes";
    } else if (moreThan1Hour) {
        return "in " + duration.hours() + "h" + duration.minutes();
    } else {
        return "in " + duration.minutes() + " minutes";
    }
}


export {convertMinsToHrsMins, readableDate, countdownDate};
