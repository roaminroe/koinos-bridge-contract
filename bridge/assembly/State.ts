import { object_space, System } from 'koinos-sdk-as';
import * as bridge from './proto/bridge';

const METADATA_SPACE_ID = 0;
const METADATA_KEY = new Uint8Array(0);

const VALIDATORS_SPACE_ID = 1;
const SUPPORTED_WRAPPED_TOKENS = 2;
const SUPPORTED_TOKENS = 3;

export class State {
  contractId: Uint8Array;
  metadataSpace: object_space;
  validatorsSpace: object_space;
  supportedWrappedTokensSpace: object_space;
  supportedTokensSpace: object_space;

  constructor(contractId: Uint8Array) {
    this.contractId = contractId;

    this.metadataSpace = new object_space(false, contractId,METADATA_SPACE_ID);
    this.validatorsSpace = new object_space(false, contractId, VALIDATORS_SPACE_ID);
    this.supportedWrappedTokensSpace = new object_space(false, contractId, SUPPORTED_WRAPPED_TOKENS);
    this.supportedTokensSpace = new object_space(false, contractId, SUPPORTED_TOKENS);
  }

  getMetadata(): bridge.metadata_object {
    const metadata = System.getObject<Uint8Array, bridge.metadata_object>(this.metadataSpace, METADATA_KEY, bridge.metadata_object.decode);

    return metadata ? metadata : new bridge.metadata_object(false, 1, 0);
  }

  saveMetadata(metadata: bridge.metadata_object): void {
    System.putObject(this.metadataSpace, METADATA_KEY, metadata, bridge.metadata_object.encode);
  }

  getValidator(address: Uint8Array): bridge.validator_object {
    const validator = System.getObject<Uint8Array, bridge.validator_object>(this.validatorsSpace, address, bridge.validator_object.decode);
    
    return validator ? validator : new bridge.validator_object();
  }

  hasValidator(address: Uint8Array): boolean {
    const validator = System.getObject<Uint8Array, bridge.validator_object>(this.validatorsSpace, address, bridge.validator_object.decode);
    
    return validator ? true : false;
  }

  removeValidator(address: Uint8Array): void {
    System.removeObject(this.validatorsSpace, address);    
  }

  saveValidator(address: Uint8Array, validator: bridge.validator_object): void {
    System.putObject(this.validatorsSpace, address, validator, bridge.validator_object.encode);
  }

  getSupportedWrappedToken(address: Uint8Array): bridge.supported_wrapped_token_object {
    const token = System.getObject<Uint8Array, bridge.supported_wrapped_token_object>(this.supportedWrappedTokensSpace, address, bridge.supported_wrapped_token_object.decode);
    
    return token ? token : new bridge.supported_wrapped_token_object;
  }

  saveSupportedWrappedToken(address: Uint8Array, wrappedToken: bridge.supported_wrapped_token_object): void {
    System.putObject(this.supportedWrappedTokensSpace, address, wrappedToken, bridge.supported_wrapped_token_object.encode);
  }

  hasSupportedWrappedToken(address: Uint8Array): boolean {
    const token = System.getObject<Uint8Array, bridge.supported_wrapped_token_object>(this.supportedWrappedTokensSpace, address, bridge.supported_wrapped_token_object.decode);
    
    return token ? true : false;
  }

  removeSupportedWrappedToken(address: Uint8Array): void {
    System.removeObject(this.supportedWrappedTokensSpace, address);    
  }

  getSupportedToken(address: Uint8Array): bridge.supported_token_object {
    const token = System.getObject<Uint8Array, bridge.supported_token_object>(this.supportedTokensSpace, address, bridge.supported_token_object.decode);
    
    return token ? token : new bridge.supported_token_object;
  }

  saveSupportedToken(address: Uint8Array, token: bridge.supported_token_object): void {
    System.putObject(this.supportedTokensSpace, address, token, bridge.supported_token_object.encode);
  }

  hasSupportedToken(address: Uint8Array): boolean {
    const token = System.getObject<Uint8Array, bridge.supported_token_object>(this.supportedTokensSpace, address, bridge.supported_token_object.decode);
    
    return token ? true : false;
  }

  removeSupportedToken(address: Uint8Array): void {
    System.removeObject(this.supportedTokensSpace, address);    
  }
}
