let {
    setActiveStatus,
    setLatitude,
    setLongitude,
    setSpeed,
    setColor,
} = require('./obu.js');
const mqtt = require('mqtt')

const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '../.env') });


const v2x_topic = 'IotMsgPlatformPartTwo/early-five-quiet-snake';
const broker = 'mqtt://161.200.92.6:27004';

// connect to MQTT broker
const client = mqtt.connect(broker);

client.on('connect', () => {
    console.log('Connected to MQTT broker');

    // subscribe to all topics related to your group
    client.subscribe([
    `${v2x_topic}/speed`,
    `${v2x_topic}/heartbeat`,
    `${v2x_topic}/route`,
    ], (err) => {
        if (err) {
            console.error('Subscribe failed:', err);
        } else {
            console.log('Subscribed successfully to all topics');
        }
    });
    console.log( `${v2x_topic}/speed`);
    console.log( `${v2x_topic}/heartbeat`);
    console.log( `${v2x_topic}/route`);

});

client.on('message', (topic, message) => {
    try {
        const data = JSON.parse(message.toString());
        if (topic.endsWith('/speed')) {
            setSpeed(data.speed);
            console.log('Speed updated to:', data.speed);
        } else if (topic.endsWith('/heartbeat')) {
            setActiveStatus(data.heartbeat);
            console.log('Active status:', data.heartbeat);
        } else if (topic.endsWith('/route')) {
            setLatitude(data.latitude);
            setLongitude(data.longitude);
            setColor(data.color);
            console.log('Route update:', data);
        }
    } catch (err) {
        console.error('Error parsing message:', err);
    }
});