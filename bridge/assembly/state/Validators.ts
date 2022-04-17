import { Space } from './Space';
import * as bridge from '../proto/bridge';

const VALIDATORS_SPACE_ID = 100;

export class Validators extends Space<Uint8Array, bridge.validator_object> {
  constructor(contractId: Uint8Array) {
    super(contractId, VALIDATORS_SPACE_ID, bridge.validator_object.decode, bridge.validator_object.encode);
  }

  get(address: Uint8Array): bridge.validator_object {
    const validator = super.get(address);

    return validator ? validator : new bridge.validator_object();
  }
}
