'use strict';
var interval = setInterval(()=>{
var body = { message: 'Hello', roomId: '6362206e7e42f3850b75692c' };

fetch('https://api.chatboxn.com/api/messages/send', {
    method: 'POST',
    headers: {
        'Content-Type': 'application/json',
        Authorization:
            'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6IjA5MjIwNjUyMjMiLCJpYXQiOjE3MTA2MTAwMzV9.ZOZoC2NLLEe14CLlZ_kmotFrYKSoEAT2AXDHFQ6eax4',
    },
    body: JSON.stringify(body),
})
    .then((res) => res.json())
    .then((data) => console.log(data))
    .catch((err) => console.log(err));
}, 45000)

