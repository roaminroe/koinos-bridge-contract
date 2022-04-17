import { object_space, System } from 'koinos-sdk-as';
import { Reader, Writer } from 'as-proto';

export class Space<K, TMessage> {
  contractId: Uint8Array;
  space: object_space;
  decoder: (reader: Reader, length: i32) => TMessage;
  encoder: (message: TMessage, writer: Writer) => void;

  constructor(
    contractId: Uint8Array,
    spaceId: u32, 
    decoder: (reader: Reader, length: i32) => TMessage,
    encoder: (message: TMessage, writer: Writer) => void,
    system: bool = false) {
    this.contractId = contractId;

    this.space = new object_space(system, contractId, spaceId);
    this.decoder = decoder;
    this.encoder = encoder;
  }

  has(key: K): boolean {
    const object = this.get(key);
    
    return object ? true : false;
  }

  get(key: K): TMessage | null {    
    return System.getObject<K, TMessage>(this.space, key, this.decoder);
  }

  getNext(key: K): System.ProtoDatabaseObject<TMessage> | null {    
    return System.getNextObject<K, TMessage>(this.space, key, this.decoder);
  }

  getPrev(key: K): System.ProtoDatabaseObject<TMessage> | null {    
    return System.getPrevObject<K, TMessage>(this.space, key, this.decoder);
  }

  put(key: K, message: TMessage): void {
    System.putObject(this.space, key, message, this.encoder);
  }

  remove(key: K): void {
    System.removeObject(this.space, key);    
  }
}
