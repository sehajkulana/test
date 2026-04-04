import { createConsumer } from "@rails/actioncable"

export default createConsumer("ws://localhost:8080/cable")