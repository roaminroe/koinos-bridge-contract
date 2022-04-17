import { Space } from './Space';
import * as bridge from '../proto/bridge';

const WRAPPED_TOKENS_SPACE_ID = 3;

export class WrappedTokens extends Space<Uint8Array, bridge.wrapped_token_object> {
  constructor(contractId: Uint8Array) {
    super(contractId, WRAPPED_TOKENS_SPACE_ID, bridge.wrapped_token_object.decode, bridge.wrapped_token_object.encode);
  }

  get(address: Uint8Array): bridge.wrapped_token_object {
    const token = super.get(address);

    return token ? token : new bridge.wrapped_token_object();
  }
}
