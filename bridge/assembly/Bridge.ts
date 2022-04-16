import { System } from "koinos-sdk-as";
import * as bridge from "./proto/bridge";
import { State } from "./State";

export class Bridge {
  _contractId: Uint8Array;
  _state: State;

  constructor() {
    this._contractId = System.getContractId();
    this._state = new State(this._contractId);
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
    // const signatures = args.signatures;
    // const validator = args.validator;

    // YOUR CODE HERE

    const res = new bridge.add_validator_result();

    return res;
  }

  remove_validator(
    args: bridge.remove_validator_arguments
  ): bridge.remove_validator_result {
    // const signatures = args.signatures;
    // const validator = args.validator;

    // YOUR CODE HERE

    const res = new bridge.remove_validator_result();

    return res;
  }

  add_supported_token(
    args: bridge.add_supported_token_arguments
  ): bridge.add_supported_token_result {
    // const signatures = args.signatures;
    // const token = args.token;

    // YOUR CODE HERE

    const res = new bridge.add_supported_token_result();

    return res;
  }

  remove_supported_token(
    args: bridge.remove_supported_token_arguments
  ): bridge.remove_supported_token_result {
    // const signatures = args.signatures;
    // const token = args.token;

    // YOUR CODE HERE

    const res = new bridge.remove_supported_token_result();

    return res;
  }

  add_supported_wrapped_token(
    args: bridge.add_supported_wrapped_token_arguments
  ): bridge.add_supported_wrapped_token_result {
    // const signatures = args.signatures;
    // const token = args.token;

    // YOUR CODE HERE

    const res = new bridge.add_supported_wrapped_token_result();

    return res;
  }

  remove_supported_wrapped_token(
    args: bridge.remove_supported_wrapped_token_arguments
  ): bridge.remove_supported_wrapped_token_result {
    // const signatures = args.signatures;
    // const token = args.token;

    // YOUR CODE HERE

    const res = new bridge.remove_supported_wrapped_token_result();

    return res;
  }
}
