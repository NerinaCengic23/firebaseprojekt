db.collection('events').onSnapshot(snapshot => {
   
    const newestEvent = snapshot.docChanges()[0].doc.data()
    const id = snapshot.docChanges()[0].doc.id
    showLatestEvent(newestEvent, id);
    
  
    snapshot.docChanges().shift()
    
    snapshot.docChanges().forEach(event => {
        showEvents(event.doc.data(), event.doc.id)
    });
})

const addNewEvent = () => {
  const event = {
    name: form.name.value,
    attendee: form.attendee.value,
    booked: 0,
    description: form.description.value,
    status: parseInt(form.status.value, 10)
  }
    db.collection('events').add(event)
    .then(() => {

    form.name.value = "",
    form.attendee.value = "",
    form.description.value = "",
    form.status.value = ""

    alert('Your event has been successfully saved')
    })
    .catch(err => console.log(err))
}

let bookedEvents = [];

const bookEvent = (booked, id) => {
  const getBookedEvents = localStorage.getItem('booked-events');

    if (getBookedEvents) {
     bookedEvents = JSON.parse(localStorage.getItem('booked-events'));
      if(bookedEvents.includes(id)) {
        alert('Seems like you have already booked this event') 
      } 
      else {
        saveBooking(booked, id)
     }
    } 
    else {
        saveBooking(booked, id)
    }
};

const saveBooking = (booked, id) => {
    bookedEvents.push(id);
    localStorage.setItem('booked-events', JSON.stringify(bookedEvents));

    const data = { booked: booked +1 }
    db.collection('events').doc(id).update(data)
    .then(() => alert('Event successfully booked'))
    .catch(err => console.log(err))
}