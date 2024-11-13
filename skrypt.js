let currentMonth = new Date().getMonth(); 
let currentYear = new Date().getFullYear();


function fetchEvents() {
    fetch(`get_events.php?month=${currentMonth + 1}&year=${currentYear}`)
        .then(response => response.json())
        .then(events => {
            displayCalendar(events); 
        })
        .catch(error => {
            console.error('Error fetching events:', error);
        });
}

function displayCalendar(events) {
    const monthYear = document.getElementById('month-year');
    const calendarGrid = document.getElementById('calendar-grid');
    monthYear.innerText = `${currentYear}-${(currentMonth + 1 < 10 ? '0' : '') + (currentMonth + 1)}`;

    
    calendarGrid.innerHTML = '';

   
    let firstDay = new Date(currentYear, currentMonth, 1).getDay();
    let lastDate = new Date(currentYear, currentMonth + 1, 0).getDate();

    
    const eventsByDay = {};
    events.forEach(event => {
        const eventDate = new Date(event.event_date);
        const day = eventDate.getDate(); 
        if (!eventsByDay[day]) {
            eventsByDay[day] = [];
        }
        eventsByDay[day].push(event); 
    });

    
    for (let i = 0; i < firstDay; i++) {
        calendarGrid.innerHTML += `<div class="empty"></div>`; 
    }

    for (let day = 1; day <= lastDate; day++) {
        
        const hasEvents = eventsByDay[day] && eventsByDay[day].length > 0;
        const eventClasses = hasEvents ? 'event' : ''; 
        calendarGrid.innerHTML += `
            <div onclick="openEventInfo(${day})" class="day ${eventClasses}">
                ${day}
            </div>`;
    }
}

function changeMonth(direction) {
    currentMonth += direction;
    if (currentMonth > 11) {
        currentMonth = 0;
        currentYear++;
    } else if (currentMonth < 0) {
        currentMonth = 11;
        currentYear--;
    }
    fetchEvents(); 
}

function openEventInfo(day) {
    
    fetch(`get_events.php?month=${currentMonth + 1}&year=${currentYear}`)
        .then(response => response.json())
        .then(events => {
            const eventsByDay = {};
            events.forEach(event => {
                const eventDate = new Date(event.event_date);
                const eventDay = eventDate.getDate();
                if (!eventsByDay[eventDay]) {
                    eventsByDay[eventDay] = [];
                }
                eventsByDay[eventDay].push(event);
            });

          
            if (eventsByDay[day] && eventsByDay[day].length > 0) {
                let eventInfo = `Events for ${currentYear}-${(currentMonth + 1 < 10 ? '0' : '') + (currentMonth + 1)}-${(day < 10 ? '0' : '') + day}:\n\n`;

               
                eventsByDay[day].forEach(event => {
                    eventInfo += `Title: ${event.event_title}\nDescription: ${event.event_description}\n\n`;
                });

            
                alert(eventInfo);
            } else {
              
                document.getElementById('event-date').value = `${currentYear}-${(currentMonth + 1 < 10 ? '0' : '') + (currentMonth + 1)}-${(day < 10 ? '0' : '') + day}`;
                document.getElementById('eventModal').style.display = 'block'; 
            }
        })
        .catch(error => {
            console.error('Error fetching event info:', error);
            alert('Error fetching events.');
        });
}

function closeModal() {
    document.getElementById('eventModal').style.display = 'none';


document.getElementById('event-form').addEventListener('submit', function (event) {
    event.preventDefault(); 

    const formData = new FormData(event.target);

 
    fetch('add_event.php', {
        method: 'POST',
        body: formData
    })
    .then(response => response.json())
    .then(result => {
        if (result.success) {
           
            closeModal();
            fetchEvents(); s
        } else {
            alert('Error creating event. Please try again.');
        }
    })
    .catch(error => {
        console.error('Error adding event:', error);
        alert('Error adding event.');
    });
});
}

document.addEventListener('DOMContentLoaded', function () {
    fetchEvents();
});
