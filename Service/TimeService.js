// services/TimeService.js

const ms = require('ms');

class TimeService {
    static getCurrentTimestamp() {
        return Date.now();
    }

    static durationToMilliseconds(duration) {
        return ms(duration);
    }

    static millisecondsToDuration(milliseconds) {
        return ms(milliseconds, { long: true });
    }

    static addDurationToDate(date, duration) {
        const dateMs = new Date(date).getTime();
        return new Date(dateMs + ms(duration));
    }

    static subtractDurationFromDate(date, duration) {
        const dateMs = new Date(date).getTime();
        return new Date(dateMs - ms(duration));
    }

    static calculateTimeDifference(date1, date2) {
        const diffMs = Math.abs(new Date(date1).getTime() - new Date(date2).getTime());
        return ms(diffMs, { long: true });
    }

    static isDateInPast(date) {
        return new Date(date).getTime() < Date.now();
    }

    static isDateInFuture(date) {
        return new Date(date).getTime() > Date.now();
    }

    static addMillisecondsToDate(date, milliseconds) {
        return new Date(new Date(date).getTime() + milliseconds);
    }

    static subtractMillisecondsFromDate(date, milliseconds) {
        return new Date(new Date(date).getTime() - milliseconds);
    }

    static getDurationFromNow(date) {
        const now = Date.now();
        const targetTime = new Date(date).getTime();
        const diff = targetTime - now;
        return ms(Math.abs(diff), { long: true });
    }
}

module.exports = TimeService;
