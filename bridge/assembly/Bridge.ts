import { Protobuf, System, Crypto } from "koinos-sdk-as";
import * as bridge from "./proto/bridge";
import { State } from "./State";

export class Bridge {
  _contractId: Uint8Array;
  _state: State;

  constructor() {
    this._contractId = System.getContractId();
    this._state = new State(this._contractId);
  }

  initialize(args: bridge.initialize_arguments): bridge.initialize_result {
    const initialValidators = args.initial_validators;
    System.require(initialValidators.length > 0, "Validators required", 1);

    const metadata = this._state.getMetadata();
    System.require(!metadata.initialized, "Contract already initialized", 1);

    for (let index = 0; index < initialValidators.length; index++) {
      const validator = initialValidators[index];

      System.require(!this._state.hasValidator(validator), "Validator not unique", 1);
      this._state.saveValidator(validator, new bridge.validator_object());
      metadata.nb_validators += 1;
    }

    metadata.initialized = true;
    this._state.saveMetadata(metadata);

    return new bridge.initialize_result();
  }

  transfer_tokens(
    args: bridge.transfer_tokens_arguments
  ): bridge.transfer_tokens_result {
    // const token = args.token;
    // const amount = args.amount;
    // const recipient = args.recipient;

    // YOUR CODE HERE

    const res = new bridge.transfer_tokens_result();

    return res;
  }

  complete_transfer(
    args: bridge.complete_transfer_arguments
  ): bridge.complete_transfer_result {
    // const transaction_id = args.transaction_id;
    // const token = args.token;
    // const recipient = args.recipient;
    // const value = args.value;
    // const signatures = args.signatures;

    // YOUR CODE HERE

    const res = new bridge.complete_transfer_result();

    return res;
  }

  add_validator(
    args: bridge.add_validator_arguments
  ): bridge.add_validator_result {
    const signatures = args.signatures;
    const validator = args.validator!;

    System.require(!this._state.hasValidator(validator), 'Validator already exists', 1);

    const metadata = this._state.getMetadata();
    const objToHash = new bridge.add_remove_action_hash(validator, metadata.nonce, this._contractId);

    const hash = System.hash(Crypto.multicodec.sha2_256, Protobuf.encode(objToHash, bridge.add_remove_action_hash.encode))!;

    this.verifySignatures(hash, signatures, metadata.nb_validators);

    const validatorObj = this._state.getValidator(validator);
    this._state.saveValidator(validator, validatorObj);

    metadata.nb_validators += 1;
    metadata.nonce += 1;
    this._state.saveMetadata(metadata);

    System.event('bridge.validator.added', new Uint8Array(0), [validator]);

    return new bridge.add_validator_result();
  }

  remove_validator(
    args: bridge.remove_validator_arguments
  ): bridge.remove_validator_result {
    const signatures = args.signatures;
    const validator = args.validator!;

    System.require(this._state.hasValidator(validator), 'Validator does not exist', 1);

    const metadata = this._state.getMetadata();
    const objToHash = new bridge.add_remove_action_hash(validator, metadata.nonce, this._contractId);

    const hash = System.hash(Crypto.multicodec.sha2_256, Protobuf.encode(objToHash, bridge.add_remove_action_hash.encode))!;

    this.verifySignatures(hash, signatures, metadata.nb_validators);

    this._state.removeValidator(validator);

    metadata.nb_validators -= 1;
    metadata.nonce += 1;
    this._state.saveMetadata(metadata);

    System.event('bridge.validator.removed', new Uint8Array(0), [validator]);

    return new bridge.remove_validator_result();
  }

  add_supported_token(
    args: bridge.add_supported_token_arguments
  ): bridge.add_supported_token_result {
    const signatures = args.signatures;
    const token = args.token!;

    System.require(!this._state.hasSupportedToken(token), 'Token already exists', 1);

    const metadata = this._state.getMetadata();
    const objToHash = new bridge.add_remove_action_hash(token, metadata.nonce, this._contractId);

    const hash = System.hash(Crypto.multicodec.sha2_256, Protobuf.encode(objToHash, bridge.add_remove_action_hash.encode))!;

    this.verifySignatures(hash, signatures, metadata.nb_validators);

    const tokenObj = this._state.getSupportedToken(token);
    this._state.saveSupportedToken(token, tokenObj);

    metadata.nonce += 1;
    this._state.saveMetadata(metadata);

    System.event('bridge.token.added', new Uint8Array(0), [token]);

    return new bridge.add_supported_token_result();
  }

  remove_supported_token(
    args: bridge.remove_supported_token_arguments
  ): bridge.remove_supported_token_result {
    const signatures = args.signatures;
    const token = args.token!;

    System.require(this._state.hasSupportedToken(token), 'Token does not exist', 1);

    const metadata = this._state.getMetadata();
    const objToHash = new bridge.add_remove_action_hash(token, metadata.nonce, this._contractId);

    const hash = System.hash(Crypto.multicodec.sha2_256, Protobuf.encode(objToHash, bridge.add_remove_action_hash.encode))!;

    this.verifySignatures(hash, signatures, metadata.nb_validators);

    this._state.removeSupportedToken(token);

    metadata.nonce += 1;
    this._state.saveMetadata(metadata);

    System.event('bridge.token.removed', new Uint8Array(0), [token]);

    return new bridge.remove_supported_token_result();
  }

  add_supported_wrapped_token(
    args: bridge.add_supported_wrapped_token_arguments
  ): bridge.add_supported_wrapped_token_result {
    const signatures = args.signatures;
    const token = args.token!;

    System.require(!this._state.hasSupportedWrappedToken(token), 'Token already exists', 1);

    const metadata = this._state.getMetadata();
    const objToHash = new bridge.add_remove_action_hash(token, metadata.nonce, this._contractId);

    const hash = System.hash(Crypto.multicodec.sha2_256, Protobuf.encode(objToHash, bridge.add_remove_action_hash.encode))!;

    this.verifySignatures(hash, signatures, metadata.nb_validators);

    const tokenObj = this._state.getSupportedWrappedToken(token);
    this._state.saveSupportedWrappedToken(token, tokenObj);

    metadata.nonce += 1;
    this._state.saveMetadata(metadata);

    System.event('bridge.wrapped_token.added', new Uint8Array(0), [token]);

    const res = new bridge.add_supported_wrapped_token_result();

    return res;
  }

  remove_supported_wrapped_token(
    args: bridge.remove_supported_wrapped_token_arguments
  ): bridge.remove_supported_wrapped_token_result {
    const signatures = args.signatures;
    const token = args.token!;

    System.require(this._state.hasSupportedWrappedToken(token), 'Token does not exist', 1);

    const metadata = this._state.getMetadata();
    const objToHash = new bridge.add_remove_action_hash(token, metadata.nonce, this._contractId);

    const hash = System.hash(Crypto.multicodec.sha2_256, Protobuf.encode(objToHash, bridge.add_remove_action_hash.encode))!;

    this.verifySignatures(hash, signatures, metadata.nb_validators);

    this._state.removeSupportedWrappedToken(token);

    metadata.nonce += 1;
    this._state.saveMetadata(metadata);

    System.event('bridge.wrapped_token.removed', new Uint8Array(0), [token]);

    return new bridge.remove_supported_wrapped_token_result();
  }

  verifySignatures(hash: Uint8Array, signatures: Uint8Array[], nbValidators: u32): void {
    System.require(
      signatures.length as u32 >= (((nbValidators * 10) / 3) * 2) / 10 + 1,
      "quorum not met",
      1
    );

    const validatorAlreadySigned = new Map<Uint8Array, boolean>();

    for (let index = 0; index < signatures.length; index++) {
      const signature = signatures[index];
      const pubKey = System.recoverPublicKey(signature, hash)!;
      const address = Crypto.addressFromPublicKey(pubKey);
      System.require(!validatorAlreadySigned.has(address) && this._state.hasValidator(address), 'invalid signatures', 1);

      validatorAlreadySigned.set(address, true);
    }
  }
}
