import consumer from "channels/consumer"

consumer.subscriptions.create("TestChannel", {
    received(data) {
        console.log(data)
    }
})

console.log("hellllllllllllll")
