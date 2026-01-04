import logger from "../utils/logger.ts";
import type {NewsAnalyzed} from "../entities/proto/news/news_pb.ts";

export const logWorker = async (event: NewsAnalyzed) => {
    logger.info("NewsAnalyzed Received");
    logger.info(`Title: ${event.title}`);
    logger.info(`Content: ${event.content.substring(0, 50)}...`);
};