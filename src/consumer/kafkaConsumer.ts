import { Kafka, type Consumer, CompressionTypes, CompressionCodecs } from "kafkajs";
import { fromBinary } from "@bufbuild/protobuf";
import { NewsAnalyzedSchema, type NewsAnalyzed } from "../entities/proto/news/news_pb.ts";
import logger from "../utils/logger.ts";
import SnappyCodec from "kafkajs-snappy";

CompressionCodecs[CompressionTypes.Snappy] = SnappyCodec;

// Make sure to set KAFKA_BROKERS, KAFKA_CLIENT_ID, KAFKA_GROUP_ID, KAFKA_DEFAULT_TOPIC, KAFKA_USERNAME, and KAFKA_PASSWORD in your .env file.

type MessageHandler = (event: NewsAnalyzed) => Promise<void> | void;

class KafkaConsumer {
    private consumer: Consumer;
    private readonly topic: string;

    constructor(kafkaSeeds: string[], kafkaClientID: string, groupId: string, topic: string) {
        const kafkaConfig: any = {
            clientId: kafkaClientID,
            brokers: kafkaSeeds,
        };

        if (Bun.env.KAFKA_USERNAME && Bun.env.KAFKA_PASSWORD) {
            kafkaConfig.sasl = {
                mechanism: 'plain',
                username: Bun.env.KAFKA_USERNAME,
                password: Bun.env.KAFKA_PASSWORD
            };
        }

        const kafka = new Kafka(kafkaConfig);
        this.consumer = kafka.consumer({ groupId });
        this.topic = topic;
    }

    async start(onMessage: MessageHandler) {
        try {
            await this.consumer.connect();
            logger.info(`Consumer connected to topic: ${this.topic}`);

            await this.consumer.subscribe({ topic: this.topic, fromBeginning: true });

            await this.consumer.run({
                eachMessage: async ({ message }) => {
                    if (!message.value) return;

                    try {
                        const event = fromBinary(NewsAnalyzedSchema, message.value);
                        await onMessage(event);
                    } catch (err) {
                        logger.error(`Failed to process message: ${err}`);
                    }
                },
            });
        } catch (error) {
            logger.error(`Error in consumer: ${error}`);
        }
    }

    async disconnect() {
        await this.consumer.disconnect();
        logger.info("Consumer disconnected");
    }
}

export default KafkaConsumer;