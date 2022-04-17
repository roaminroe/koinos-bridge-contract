import { Space } from './Space';
import * as bridge from '../proto/bridge';

const TOKENS_SPACE_ID = 101;

export class Tokens extends Space<Uint8Array, bridge.token_object> {
  constructor(contractId: Uint8Array) {
    super(contractId, TOKENS_SPACE_ID, bridge.token_object.decode, bridge.token_object.encode);
  }

  get(address: Uint8Array): bridge.token_object {
    const token = super.get(address);

    return token ? token : new bridge.token_object();
  }
}
