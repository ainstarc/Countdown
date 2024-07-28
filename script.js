function updateCountdown() {
    const targetDate = new Date('2028-09-29T00:00:00+05:30');
    const currentDate = new Date();
    const timeDifference = targetDate - currentDate;

    const days = Math.floor(timeDifference / (1000 * 60 * 60 * 24));
    const hours = Math.floor((timeDifference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((timeDifference % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((timeDifference % (1000 * 60)) / 1000);

    document.getElementById('days').textContent = days;
    document.getElementById('hours').textContent = hours;
    document.getElementById('minutes').textContent = minutes;
    document.getElementById('seconds').textContent = seconds;

    if (timeDifference < 0) {
        clearInterval(countdownInterval);
        document.getElementById('countdown').textContent = 'Event has passed';
    }
}

const countdownInterval = setInterval(updateCountdown, 1000);
updateCountdown();
