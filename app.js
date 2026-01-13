/**
 * 电饭煲定时计算器
 * Rice Cooker Timer Calculator
 */

// DOM Elements
const currentTimeEl = document.getElementById('currentTime');
const currentDateEl = document.getElementById('currentDate');
const hourSlider = document.getElementById('hourSlider');
const minuteSlider = document.getElementById('minuteSlider');
const hourValue = document.getElementById('hourValue');
const minuteValue = document.getElementById('minuteValue');
const resultHours = document.getElementById('resultHours');
const resultMinutes = document.getElementById('resultMinutes');
const totalMinutes = document.getElementById('totalMinutes');
const resultSummary = document.getElementById('resultSummary');
const timelineNow = document.getElementById('timelineNow');
const timelineTarget = document.getElementById('timelineTarget');
const timelineProgress = document.getElementById('timelineProgress');
const quickBtns = document.querySelectorAll('.quick-btn');

// State
let targetHour = 7;
let targetMinute = 0;

/**
 * Format number with leading zero
 * @param {number} num - Number to format
 * @returns {string} Formatted string
 */
function padZero(num) {
    return num.toString().padStart(2, '0');
}

/**
 * Update current time display
 */
function updateCurrentTime() {
    const now = new Date();
    
    // Format time
    const hours = padZero(now.getHours());
    const minutes = padZero(now.getMinutes());
    const seconds = padZero(now.getSeconds());
    currentTimeEl.textContent = `${hours}:${minutes}:${seconds}`;
    
    // Format date
    const year = now.getFullYear();
    const month = now.getMonth() + 1;
    const day = now.getDate();
    const weekDays = ['日', '一', '二', '三', '四', '五', '六'];
    const weekDay = weekDays[now.getDay()];
    currentDateEl.textContent = `${year}年${month}月${day}日 星期${weekDay}`;
    
    // Update timeline now
    timelineNow.textContent = `${hours}:${minutes}`;
}

/**
 * Calculate timer duration
 * @returns {Object} Object containing hours, minutes, and total minutes
 */
function calculateTimerDuration() {
    const now = new Date();
    
    // Create target time for tomorrow
    const target = new Date(now);
    target.setDate(target.getDate() + 1); // Tomorrow
    target.setHours(targetHour, targetMinute, 0, 0);
    
    // Calculate difference in milliseconds
    const diffMs = target - now;
    
    // Convert to minutes
    const totalMins = Math.ceil(diffMs / (1000 * 60));
    
    // Convert to hours and minutes
    const hours = Math.floor(totalMins / 60);
    const mins = totalMins % 60;
    
    return {
        hours,
        minutes: mins,
        totalMinutes: totalMins
    };
}

/**
 * Update result display
 */
function updateResult() {
    const result = calculateTimerDuration();
    
    // Update result display with animation
    resultHours.textContent = padZero(result.hours);
    resultMinutes.textContent = padZero(result.minutes);
    totalMinutes.textContent = result.totalMinutes;
    
    // Update summary text
    resultSummary.innerHTML = `从现在到明天 <strong>${padZero(targetHour)}:${padZero(targetMinute)}</strong>，共需定时 <strong>${result.totalMinutes}</strong> 分钟`;
    
    // Update timeline
    timelineTarget.textContent = `${padZero(targetHour)}:${padZero(targetMinute)}`;
    
    // Update timeline progress (visual effect only)
    const maxMinutes = 24 * 60; // 24 hours max
    const progressPercent = Math.min((result.totalMinutes / maxMinutes) * 100, 100);
    timelineProgress.style.width = `${100 - progressPercent}%`;
}

/**
 * Update slider value display
 */
function updateSliderDisplay() {
    hourValue.textContent = padZero(targetHour);
    minuteValue.textContent = padZero(targetMinute);
    
    // Update active quick button
    quickBtns.forEach(btn => {
        const btnHour = parseInt(btn.dataset.hour);
        const btnMinute = parseInt(btn.dataset.minute);
        
        if (btnHour === targetHour && btnMinute === targetMinute) {
            btn.classList.add('active');
        } else {
            btn.classList.remove('active');
        }
    });
    
    updateResult();
}

/**
 * Handle hour slider change
 */
function onHourSliderChange() {
    targetHour = parseInt(hourSlider.value);
    updateSliderDisplay();
    
    // Add haptic feedback animation
    hourValue.style.transform = 'scale(1.1)';
    setTimeout(() => {
        hourValue.style.transform = 'scale(1)';
    }, 100);
}

/**
 * Handle minute slider change
 */
function onMinuteSliderChange() {
    targetMinute = parseInt(minuteSlider.value);
    updateSliderDisplay();
    
    // Add haptic feedback animation
    minuteValue.style.transform = 'scale(1.1)';
    setTimeout(() => {
        minuteValue.style.transform = 'scale(1)';
    }, 100);
}

/**
 * Handle quick button click
 * @param {Event} e - Click event
 */
function onQuickBtnClick(e) {
    const btn = e.target;
    targetHour = parseInt(btn.dataset.hour);
    targetMinute = parseInt(btn.dataset.minute);
    
    // Update sliders
    hourSlider.value = targetHour;
    minuteSlider.value = targetMinute;
    
    updateSliderDisplay();
    
    // Add ripple effect
    btn.style.transform = 'scale(0.95)';
    setTimeout(() => {
        btn.style.transform = 'scale(1)';
    }, 100);
}

/**
 * Initialize the application
 */
function init() {
    // Set initial slider values
    hourSlider.value = targetHour;
    minuteSlider.value = targetMinute;
    
    // Add event listeners
    hourSlider.addEventListener('input', onHourSliderChange);
    minuteSlider.addEventListener('input', onMinuteSliderChange);
    
    // Quick button event listeners
    quickBtns.forEach(btn => {
        btn.addEventListener('click', onQuickBtnClick);
    });
    
    // Initial update
    updateCurrentTime();
    updateSliderDisplay();
    
    // Update current time every second
    setInterval(() => {
        updateCurrentTime();
        updateResult(); // Also update result to keep it current
    }, 1000);
}

// Start the application when DOM is ready
document.addEventListener('DOMContentLoaded', init);
