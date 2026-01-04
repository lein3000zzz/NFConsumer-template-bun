import KafkaConsumer from "./consumer/kafkaConsumer.ts";
import {logWorker} from "./worker/logworker.ts";

const consumer = new KafkaConsumer(
    Bun.env.KAFKA_BROKERS ? Bun.env.KAFKA_BROKERS!.split(",") : ["localhost:9092"],
    Bun.env.KAFKA_CLIENT_ID || "template-consumer-service",
    Bun.env.KAFKA_GROUP_ID || "template-consumer-group",
    Bun.env.KAFKA_DEFAULT_TOPIC || "newsanalyzed"
);

// Place your message handler logic inside the start method (logWorker as an example)
await consumer.start(logWorker);