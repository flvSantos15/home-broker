import * as kafkaLib from '@confluentinc/kafka-javascript';
import { BaseRpcContext } from '@nestjs/microservices';
import { KafkaMessage } from '@nestjs/microservices/external/kafka.interface';

type ConfluentKafkaContextArgs = [
  message: KafkaMessage,
  partition: number,
  topic: string,
  consumer: kafkaLib.KafkaJS.Consumer,
  heartbeat: () => Promise<void>,
  producer: kafkaLib.KafkaJS.Producer,
];

export class ConfluentKafkaContext extends BaseRpcContext {
  constructor(args: ConfluentKafkaContextArgs) {
    super(args);
  }

  getMessage(): KafkaMessage {
    return this.getArgByIndex(0);
  }

  getPartition(): number {
    return this.getArgByIndex(1);
  }

  getTopic(): string {
    return this.getArgByIndex(2);
  }

  getConsumer(): kafkaLib.KafkaJS.Consumer {
    return this.getArgByIndex(3);
  }

  getHeartbeat(): () => Promise<void> {
    return this.getArgByIndex(4);
  }

  getProducer(): kafkaLib.KafkaJS.Producer {
    return this.getArgByIndex(5);
  }
}
export {};
