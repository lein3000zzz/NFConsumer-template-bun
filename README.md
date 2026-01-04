# NFConsumer-template-bun

NFConsumer-template-bun is a Bun-based template for consuming and processing `NewsAnalyzed` messages from Apache Kafka. 
It provides a starting point for building consumers that handle analyzed news data produced by the NewsFinder application. 
The template uses Protobuf for efficient message deserialization, KafkaJS for Kafka integration, and includes a simple 
logging worker as an example handler.

## Related Projects

1. [NewsFinder](https://github.com/lein3000zzz/NewsFinder) - The main Go-based news processing application
2. [NFProducer-template-bun](https://github.com/lein3000zzz/NFProducer-template-bun) - Bun template for producing news events to Kafka
2. [News Producer Bitget Example](https://github.com/lein3000zzz/NFProducer-bitget) - A direct implementation based on this template.
4. [The Telegram Bot](https://t.me/crypto_NewsFinderBot)

## Features

- Kafka consumption of `NewsAnalyzed` messages
- Protobuf deserialization using `@bufbuild/protobuf`
- Example message handler (logging) in `src/worker/logworker.ts`
- Docker and Docker Compose support for easy deployment
- Structured logging with `@logtape/logtape`

## Prerequisites

- Bun (latest recommended)
- Docker & Docker Compose (for containerized deployment)
- Access to a Kafka broker (e.g., via Docker Compose in the NewsFinder setup)

## Installation

Clone the repository:

```bash
git clone https://github.com/lein3000zzz/NFConsumer-template-bun.git
cd NFConsumer-template-bun
```

Install dependencies:

```bash
bun install
```

## Usage

To run the consumer locally:

```bash
bun run start
```

For containerized deployment, ensure you have a Kafka broker running (e.g., via the NewsFinder setup) and run:

```bash
docker-compose up -d
```

The consumer will start listening to the `newsanalyzed` topic and process messages using the example `logWorker`.

## Configuration

Configure the following environment variables in your `.env` file:

- `LOGGING_LEVEL`: Logging level (e.g., "debug", "info")
- `KAFKA_DEFAULT_TOPIC`: Kafka topic to consume from (default: "newsanalyzed")
- `KAFKA_CLIENT_ID`: Client ID for Kafka consumer
- `KAFKA_GROUP_ID`: Consumer group ID
- `KAFKA_BROKERS`: Comma-separated list of Kafka brokers (e.g., "localhost:9092")
- `KAFKA_USERNAME`: Username for Kafka authentication (optional)
- `KAFKA_PASSWORD`: Password for Kafka authentication (optional)

## Customization

To customize the message handling logic, replace the `logWorker` in `src/index.ts` with your own handler function. The handler receives a `NewsAnalyzed` object with the following structure:

- `source`: Source information (name, credibility)
- `title`: News title
- `content`: News content
- `published_at`: Publication timestamp
- `ingested_at`: Ingestion timestamp
- `prepared_at`: Preparation timestamp
- `analysis`: Analysis results (sentiment, tags, etc.) as a protobuf struct

## License

This project is licensed under the terms specified in LICENSE.
