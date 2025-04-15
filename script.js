let selectedDate = null;
const bookedDates = ['2025-04-18', '2025-04-22', '2025-04-27', '2025-05-10', '2025-05-15'];
const availableDates = ['2025-04-20', '2025-04-25', '2025-05-05', '2025-05-12', '2025-05-20'];

const calendarDays = document.getElementById('calendar-days');
const monthYearElement = document.getElementById('month-year');
const prevMonthBtn = document.getElementById('prev-month');
const nextMonthBtn = document.getElementById('next-month');
const selectedDateElement = document.getElementById('selected-date');
const eventDateInput = document.getElementById('event-date');
const bookingForm = document.getElementById('booking-form');
const summaryBtn = document.getElementById('summary-btn');
const summaryModal = document.getElementById('summary-modal');
const confirmationModal = document.getElementById('confirmation-modal');
const closeModalButtons = document.querySelectorAll('.close-modal');
const closeConfirmationBtn = document.querySelector('.close-confirmation');
const confirmBookingBtn = document.getElementById('confirm-booking');
const summaryContent = document.getElementById('summary-content');
const bookingReference = document.getElementById('booking-reference');
const eventCardBookButtons = document.querySelectorAll('.event-card .btn');

const currentDate = new Date();
let currentMonth = currentDate.getMonth();
let currentYear = currentDate.getFullYear();

document.addEventListener('DOMContentLoaded', () => {
    renderCalendar(currentMonth, currentYear);
    setupEventListeners();
    validateFormOnInput();
});

function setupEventListeners() {
    prevMonthBtn.addEventListener('click', () => {
        currentMonth--;
        if (currentMonth < 0) {
            currentMonth = 11;
            currentYear--;
        }
        renderCalendar(currentMonth, currentYear);
    });

    nextMonthBtn.addEventListener('click', () => {
        currentMonth++;
        if (currentMonth > 11) {
            currentMonth = 0;
            currentYear++;
        }
        renderCalendar(currentMonth, currentYear);
    });

    bookingForm.addEventListener('submit', (e) => {
        e.preventDefault();
        if (validateForm()) {
            openSummaryModal();
        }
    });

    summaryBtn.addEventListener('click', () => {
        if (validateForm()) {
            openSummaryModal();
        }
    });

    confirmBookingBtn.addEventListener('click', () => {
        summaryModal.style.display = 'none';
        showConfirmation();
    });

    closeModalButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            summaryModal.style.display = 'none';
            confirmationModal.style.display = 'none';
        });
    });

    closeConfirmationBtn.addEventListener('click', () => {
        confirmationModal.style.display = 'none';
        resetForm();
    });

    window.addEventListener('click', (e) => {
        if (e.target === summaryModal) {
            summaryModal.style.display = 'none';
        }
        if (e.target === confirmationModal) {
            confirmationModal.style.display = 'none';
        }
    });

    eventCardBookButtons.forEach(btn => {
        btn.addEventListener('click', (e) => {
            const card = e.target.closest('.event-card');
            const month = card.querySelector('.month').textContent;
            const day = card.querySelector('.day').textContent;
            const eventName = card.querySelector('h3').textContent;
            
            document.getElementById('booking-section').scrollIntoView({ behavior: 'smooth' });
            
            const eventDate = new Date(currentYear, getMonthNumber(month), parseInt(day));
            selectDate(eventDate);
            
            if (eventName.includes('Conference')) {
                document.getElementById('event-type').value = 'conference';
            } else if (eventName.includes('Workshop')) {
                document.getElementById('event-type').value = 'workshop';
            } else if (eventName.includes('Party')) {
                document.getElementById('event-type').value = 'party';
            } else {
                document.getElementById('event-type').value = 'other';
            }
        });
    });
}

function getMonthNumber(monthName) {
    const months = {
        'Jan': 0, 'Feb': 1, 'Mar': 2, 'Apr': 3, 'May': 4, 'Jun': 5,
        'Jul': 6, 'Aug': 7, 'Sep': 8, 'Oct': 9, 'Nov': 10, 'Dec': 11
    };
    return months[monthName];
}

function renderCalendar(month, year) {
    calendarDays.innerHTML = '';
    
    const monthNames = ['January', 'February', 'March', 'April', 'May', 'June',
                        'July', 'August', 'September', 'October', 'November', 'December'];
    monthYearElement.textContent = `${monthNames[month]} ${year}`;
    
    const firstDay = new Date(year, month, 1).getDay();
    
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    
    const daysInPrevMonth = new Date(year, month, 0).getDate();
    
    for (let i = firstDay - 1; i >= 0; i--) {
        const dayElement = document.createElement('div');
        dayElement.classList.add('day', 'other-month');
        dayElement.textContent = daysInPrevMonth - i;
        calendarDays.appendChild(dayElement);
    }
    
    for (let day = 1; day <= daysInMonth; day++) {
        const dayElement = document.createElement('div');
        dayElement.classList.add('day');
        dayElement.textContent = day;
        
        const currentDateString = `${currentDate.getFullYear()}-${(currentDate.getMonth() + 1).toString().padStart(2, '0')}-${currentDate.getDate().toString().padStart(2, '0')}`;
        const calendarDateString = `${year}-${(month + 1).toString().padStart(2, '0')}-${day.toString().padStart(2, '0')}`;
        
        if (currentDateString === calendarDateString) {
            dayElement.classList.add('today');
        }
        
        if (selectedDate && day === selectedDate.getDate() && 
            month === selectedDate.getMonth() && year === selectedDate.getFullYear()) {
            dayElement.classList.add('selected');
        }
        
        if (availableDates.includes(calendarDateString)) {
            dayElement.classList.add('available');
        }
        
        if (bookedDates.includes(calendarDateString)) {
            dayElement.classList.add('unavailable');
        }
        
        dayElement.addEventListener('click', () => {
            if (!dayElement.classList.contains('unavailable')) {
                const clickedDate = new Date(year, month, day);
                selectDate(clickedDate);
            }
        });
        
        calendarDays.appendChild(dayElement);
    }
    
    const totalDays = calendarDays.childElementCount;
    const remainingDays = 42 - totalDays; 
    
    for (let day = 1; day <= remainingDays; day++) {
        const dayElement = document.createElement('div');
        dayElement.classList.add('day', 'other-month');
        dayElement.textContent = day;
        calendarDays.appendChild(dayElement);
    }
}

function selectDate(date) {
    selectedDate = date;
    
    const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
    const formattedDate = date.toLocaleDateString('en-US', options);
    selectedDateElement.textContent = formattedDate;
    eventDateInput.value = formattedDate;
    
    const allDays = document.querySelectorAll('.day');
    allDays.forEach(day => {
        day.classList.remove('selected');
    });
    
    if (date.getMonth() === currentMonth && date.getFullYear() === currentYear) {
        const dayElements = document.querySelectorAll('.day:not(.other-month)');
        dayElements[date.getDate() - 1].classList.add('selected');
    } else {
        currentMonth = date.getMonth();
        currentYear = date.getFullYear();
        renderCalendar(currentMonth, currentYear);
    }
    
    document.getElementById('date-error').textContent = '';
}

function validateForm() {
    let isValid = true;
    
    const name = document.getElementById('name');
    const nameError = document.getElementById('name-error');
    if (!name.value.trim()) {
        nameError.textContent = 'Name is required';
        isValid = false;
    } else if (name.value.trim().length < 3) {
        nameError.textContent = 'Name must be at least 3 characters';
        isValid = false;
    } else {
        nameError.textContent = '';
    }
    
    const email = document.getElementById('email');
    const emailError = document.getElementById('email-error');
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email.value.trim()) {
        emailError.textContent = 'Email is required';
        isValid = false;
    } else if (!emailRegex.test(email.value.trim())) {
        emailError.textContent = 'Please enter a valid email address';
        isValid = false;
    } else {
        emailError.textContent = '';
    }
    
    const phone = document.getElementById('phone');
    const phoneError = document.getElementById('phone-error');
    const phoneRegex = /^\d{10,15}$/;
    if (!phone.value.trim()) {
        phoneError.textContent = 'Phone number is required';
        isValid = false;
    } else if (!phoneRegex.test(phone.value.replace(/\D/g, ''))) {
        phoneError.textContent = 'Please enter a valid phone number';
        isValid = false;
    } else {
        phoneError.textContent = '';
    }
    
    const dateError = document.getElementById('date-error');
    if (!selectedDate) {
        dateError.textContent = 'Please select a date from the calendar';
        isValid = false;
    } else {
        dateError.textContent = '';
    }
    
    const eventType = document.getElementById('event-type');
    const eventTypeError = document.getElementById('event-type-error');
    if (!eventType.value) {
        eventTypeError.textContent = 'Please select an event type';
        isValid = false;
    } else {
        eventTypeError.textContent = '';
    }
    
    const attendees = document.getElementById('attendees');
    const attendeesError = document.getElementById('attendees-error');
    if (!attendees.value) {
        attendeesError.textContent = 'Number of attendees is required';
        isValid = false;
    } else if (attendees.value < 1) {
        attendeesError.textContent = 'Number of attendees must be at least 1';
        isValid = false;
    } else {
        attendeesError.textContent = '';
    }
    
    return isValid;
}

function validateFormOnInput() {
    const name = document.getElementById('name');
    const email = document.getElementById('email');
    const phone = document.getElementById('phone');
    const eventType = document.getElementById('event-type');
    const attendees = document.getElementById('attendees');
    
    name.addEventListener('input', () => {
        const nameError = document.getElementById('name-error');
        if (!name.value.trim()) {
            nameError.textContent = 'Name is required';
        } else if (name.value.trim().length < 3) {
            nameError.textContent = 'Name must be at least 3 characters';
        } else {
            nameError.textContent = '';
        }
    });
    
    email.addEventListener('input', () => {
        const emailError = document.getElementById('email-error');
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!email.value.trim()) {
            emailError.textContent = 'Email is required';
        } else if (!emailRegex.test(email.value.trim())) {
            emailError.textContent = 'Please enter a valid email address';
        } else {
            emailError.textContent = '';
        }
    });
    
    phone.addEventListener('input', () => {
        const phoneError = document.getElementById('phone-error');
        const phoneRegex = /^\d{10,15}$/;
        if (!phone.value.trim()) {
            phoneError.textContent = 'Phone number is required';
        } else if (!phoneRegex.test(phone.value.replace(/\D/g, ''))) {
            phoneError.textContent = 'Please enter a valid phone number';
        } else {
            phoneError.textContent = '';
        }
    });
    
    eventType.addEventListener('change', () => {
        const eventTypeError = document.getElementById('event-type-error');
        if (!eventType.value) {
            eventTypeError.textContent = 'Please select an event type';
        } else {
            eventTypeError.textContent = '';
        }
    });
    
    attendees.addEventListener('input', () => {
        const attendeesError = document.getElementById('attendees-error');
        if (!attendees.value) {
            attendeesError.textContent = 'Number of attendees is required';
        } else if (attendees.value < 1) {
            attendeesError.textContent = 'Number of attendees must be at least 1';
        } else {
            attendeesError.textContent = '';
        }
    });
}

function openSummaryModal() {
    const name = document.getElementById('name').value;
    const email = document.getElementById('email').value;
    const phone = document.getElementById('phone').value;
    const eventType = document.getElementById('event-type').value;
    const eventTypeText = document.getElementById('event-type').options[document.getElementById('event-type').selectedIndex].text;
    const attendees = document.getElementById('attendees').value;
    const eventDetails = document.getElementById('event-details').value;
    
    const formattedDate = selectedDate.toLocaleDateString('en-US', { 
        weekday: 'long', 
        year: 'numeric', 
        month: 'long', 
        day: 'numeric' 
    });
    
    summaryContent.innerHTML = `
        <p><strong>Name:</strong> ${name}</p>
        <p><strong>Email:</strong> ${email}</p>
        <p><strong>Phone:</strong> ${phone}</p>
        <p><strong>Event Date:</strong> ${formattedDate}</p>
        <p><strong>Event Type:</strong> ${eventTypeText}</p>
        <p><strong>Number of Attendees:</strong> ${attendees}</p>
        ${eventDetails ? `<p><strong>Additional Details:</strong> ${eventDetails}</p>` : ''}
    `;
    
    summaryModal.style.display = 'flex';
}

function showConfirmation() {
    const reference = `EBS-${Math.floor(Math.random() * 10000).toString().padStart(4, '0')}`;
    bookingReference.textContent = reference;
    
    confirmationModal.style.display = 'flex';
}

function resetForm() {
    bookingForm.reset();
    selectedDate = null;
    selectedDateElement.textContent = 'None';
    
    const allDays = document.querySelectorAll('.day');
    allDays.forEach(day => {
        day.classList.remove('selected');
    });
}

function addDayTooltip(dayElement, date) {
    const dateString = `${date.getFullYear()}-${(date.getMonth() + 1).toString().padStart(2, '0')}-${date.getDate().toString().padStart(2, '0')}`;
    
    if (availableDates.includes(dateString)) {
        dayElement.setAttribute('title', 'Available for booking');
    } else if (bookedDates.includes(dateString)) {
        dayElement.setAttribute('title', 'Already booked');
    }
}