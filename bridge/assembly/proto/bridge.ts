import { Writer, Reader } from "as-proto";

export class initialize_arguments {
  static encode(message: initialize_arguments, writer: Writer): void {
    const field_initial_validators = message.initial_validators;
    if (field_initial_validators.length !== 0) {
      for (let i = 0; i < field_initial_validators.length; ++i) {
        writer.uint32(10);
        writer.bytes(field_initial_validators[i]);
      }
    }
  }

  static decode(reader: Reader, length: i32): initialize_arguments {
    const end: usize = length < 0 ? reader.end : reader.ptr + length;
    const message = new initialize_arguments();

    while (reader.ptr < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          message.initial_validators.push(reader.bytes());
          break;

        default:
          reader.skipType(tag & 7);
          break;
      }
    }

    return message;
  }

  initial_validators: Array<Uint8Array>;

  constructor(initial_validators: Array<Uint8Array> = []) {
    this.initial_validators = initial_validators;
  }
}

@unmanaged
export class initialize_result {
  static encode(message: initialize_result, writer: Writer): void {}

  static decode(reader: Reader, length: i32): initialize_result {
    const end: usize = length < 0 ? reader.end : reader.ptr + length;
    const message = new initialize_result();

    while (reader.ptr < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        default:
          reader.skipType(tag & 7);
          break;
      }
    }

    return message;
  }

  constructor() {}
}

export class transfer_tokens_arguments {
  static encode(message: transfer_tokens_arguments, writer: Writer): void {
    const field_token = message.token;
    if (field_token !== null) {
      writer.uint32(10);
      writer.bytes(field_token);
    }

    writer.uint32(16);
    writer.uint64(message.amount);

    const field_recipient = message.recipient;
    if (field_recipient !== null) {
      writer.uint32(26);
      writer.string(field_recipient);
    }
  }

  static decode(reader: Reader, length: i32): transfer_tokens_arguments {
    const end: usize = length < 0 ? reader.end : reader.ptr + length;
    const message = new transfer_tokens_arguments();

    while (reader.ptr < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          message.token = reader.bytes();
          break;

        case 2:
          message.amount = reader.uint64();
          break;

        case 3:
          message.recipient = reader.string();
          break;

        default:
          reader.skipType(tag & 7);
          break;
      }
    }

    return message;
  }

  token: Uint8Array | null;
  amount: u64;
  recipient: string | null;

  constructor(
    token: Uint8Array | null = null,
    amount: u64 = 0,
    recipient: string | null = null
  ) {
    this.token = token;
    this.amount = amount;
    this.recipient = recipient;
  }
}

@unmanaged
export class transfer_tokens_result {
  static encode(message: transfer_tokens_result, writer: Writer): void {}

  static decode(reader: Reader, length: i32): transfer_tokens_result {
    const end: usize = length < 0 ? reader.end : reader.ptr + length;
    const message = new transfer_tokens_result();

    while (reader.ptr < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        default:
          reader.skipType(tag & 7);
          break;
      }
    }

    return message;
  }

  constructor() {}
}

export class complete_transfer_arguments {
  static encode(message: complete_transfer_arguments, writer: Writer): void {
    const field_transaction_id = message.transaction_id;
    if (field_transaction_id !== null) {
      writer.uint32(10);
      writer.bytes(field_transaction_id);
    }

    const field_token = message.token;
    if (field_token !== null) {
      writer.uint32(18);
      writer.bytes(field_token);
    }

    const field_recipient = message.recipient;
    if (field_recipient !== null) {
      writer.uint32(26);
      writer.bytes(field_recipient);
    }

    writer.uint32(32);
    writer.uint64(message.value);

    const field_signatures = message.signatures;
    if (field_signatures.length !== 0) {
      for (let i = 0; i < field_signatures.length; ++i) {
        writer.uint32(50);
        writer.bytes(field_signatures[i]);
      }
    }
  }

  static decode(reader: Reader, length: i32): complete_transfer_arguments {
    const end: usize = length < 0 ? reader.end : reader.ptr + length;
    const message = new complete_transfer_arguments();

    while (reader.ptr < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          message.transaction_id = reader.bytes();
          break;

        case 2:
          message.token = reader.bytes();
          break;

        case 3:
          message.recipient = reader.bytes();
          break;

        case 4:
          message.value = reader.uint64();
          break;

        case 6:
          message.signatures.push(reader.bytes());
          break;

        default:
          reader.skipType(tag & 7);
          break;
      }
    }

    return message;
  }

  transaction_id: Uint8Array | null;
  token: Uint8Array | null;
  recipient: Uint8Array | null;
  value: u64;
  signatures: Array<Uint8Array>;

  constructor(
    transaction_id: Uint8Array | null = null,
    token: Uint8Array | null = null,
    recipient: Uint8Array | null = null,
    value: u64 = 0,
    signatures: Array<Uint8Array> = []
  ) {
    this.transaction_id = transaction_id;
    this.token = token;
    this.recipient = recipient;
    this.value = value;
    this.signatures = signatures;
  }
}

@unmanaged
export class complete_transfer_result {
  static encode(message: complete_transfer_result, writer: Writer): void {}

  static decode(reader: Reader, length: i32): complete_transfer_result {
    const end: usize = length < 0 ? reader.end : reader.ptr + length;
    const message = new complete_transfer_result();

    while (reader.ptr < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        default:
          reader.skipType(tag & 7);
          break;
      }
    }

    return message;
  }

  constructor() {}
}

export class add_validator_arguments {
  static encode(message: add_validator_arguments, writer: Writer): void {
    const field_signatures = message.signatures;
    if (field_signatures.length !== 0) {
      for (let i = 0; i < field_signatures.length; ++i) {
        writer.uint32(10);
        writer.bytes(field_signatures[i]);
      }
    }

    const field_validator = message.validator;
    if (field_validator !== null) {
      writer.uint32(18);
      writer.bytes(field_validator);
    }
  }

  static decode(reader: Reader, length: i32): add_validator_arguments {
    const end: usize = length < 0 ? reader.end : reader.ptr + length;
    const message = new add_validator_arguments();

    while (reader.ptr < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          message.signatures.push(reader.bytes());
          break;

        case 2:
          message.validator = reader.bytes();
          break;

        default:
          reader.skipType(tag & 7);
          break;
      }
    }

    return message;
  }

  signatures: Array<Uint8Array>;
  validator: Uint8Array | null;

  constructor(
    signatures: Array<Uint8Array> = [],
    validator: Uint8Array | null = null
  ) {
    this.signatures = signatures;
    this.validator = validator;
  }
}

@unmanaged
export class add_validator_result {
  static encode(message: add_validator_result, writer: Writer): void {}

  static decode(reader: Reader, length: i32): add_validator_result {
    const end: usize = length < 0 ? reader.end : reader.ptr + length;
    const message = new add_validator_result();

    while (reader.ptr < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        default:
          reader.skipType(tag & 7);
          break;
      }
    }

    return message;
  }

  constructor() {}
}

export class remove_validator_arguments {
  static encode(message: remove_validator_arguments, writer: Writer): void {
    const field_signatures = message.signatures;
    if (field_signatures.length !== 0) {
      for (let i = 0; i < field_signatures.length; ++i) {
        writer.uint32(10);
        writer.bytes(field_signatures[i]);
      }
    }

    const field_validator = message.validator;
    if (field_validator !== null) {
      writer.uint32(18);
      writer.bytes(field_validator);
    }
  }

  static decode(reader: Reader, length: i32): remove_validator_arguments {
    const end: usize = length < 0 ? reader.end : reader.ptr + length;
    const message = new remove_validator_arguments();

    while (reader.ptr < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          message.signatures.push(reader.bytes());
          break;

        case 2:
          message.validator = reader.bytes();
          break;

        default:
          reader.skipType(tag & 7);
          break;
      }
    }

    return message;
  }

  signatures: Array<Uint8Array>;
  validator: Uint8Array | null;

  constructor(
    signatures: Array<Uint8Array> = [],
    validator: Uint8Array | null = null
  ) {
    this.signatures = signatures;
    this.validator = validator;
  }
}

@unmanaged
export class remove_validator_result {
  static encode(message: remove_validator_result, writer: Writer): void {}

  static decode(reader: Reader, length: i32): remove_validator_result {
    const end: usize = length < 0 ? reader.end : reader.ptr + length;
    const message = new remove_validator_result();

    while (reader.ptr < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        default:
          reader.skipType(tag & 7);
          break;
      }
    }

    return message;
  }

  constructor() {}
}

export class add_supported_token_arguments {
  static encode(message: add_supported_token_arguments, writer: Writer): void {
    const field_signatures = message.signatures;
    if (field_signatures.length !== 0) {
      for (let i = 0; i < field_signatures.length; ++i) {
        writer.uint32(10);
        writer.bytes(field_signatures[i]);
      }
    }

    const field_token = message.token;
    if (field_token !== null) {
      writer.uint32(18);
      writer.bytes(field_token);
    }
  }

  static decode(reader: Reader, length: i32): add_supported_token_arguments {
    const end: usize = length < 0 ? reader.end : reader.ptr + length;
    const message = new add_supported_token_arguments();

    while (reader.ptr < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          message.signatures.push(reader.bytes());
          break;

        case 2:
          message.token = reader.bytes();
          break;

        default:
          reader.skipType(tag & 7);
          break;
      }
    }

    return message;
  }

  signatures: Array<Uint8Array>;
  token: Uint8Array | null;

  constructor(
    signatures: Array<Uint8Array> = [],
    token: Uint8Array | null = null
  ) {
    this.signatures = signatures;
    this.token = token;
  }
}

@unmanaged
export class add_supported_token_result {
  static encode(message: add_supported_token_result, writer: Writer): void {}

  static decode(reader: Reader, length: i32): add_supported_token_result {
    const end: usize = length < 0 ? reader.end : reader.ptr + length;
    const message = new add_supported_token_result();

    while (reader.ptr < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        default:
          reader.skipType(tag & 7);
          break;
      }
    }

    return message;
  }

  constructor() {}
}

export class remove_supported_token_arguments {
  static encode(
    message: remove_supported_token_arguments,
    writer: Writer
  ): void {
    const field_signatures = message.signatures;
    if (field_signatures.length !== 0) {
      for (let i = 0; i < field_signatures.length; ++i) {
        writer.uint32(10);
        writer.bytes(field_signatures[i]);
      }
    }

    const field_token = message.token;
    if (field_token !== null) {
      writer.uint32(18);
      writer.bytes(field_token);
    }
  }

  static decode(reader: Reader, length: i32): remove_supported_token_arguments {
    const end: usize = length < 0 ? reader.end : reader.ptr + length;
    const message = new remove_supported_token_arguments();

    while (reader.ptr < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          message.signatures.push(reader.bytes());
          break;

        case 2:
          message.token = reader.bytes();
          break;

        default:
          reader.skipType(tag & 7);
          break;
      }
    }

    return message;
  }

  signatures: Array<Uint8Array>;
  token: Uint8Array | null;

  constructor(
    signatures: Array<Uint8Array> = [],
    token: Uint8Array | null = null
  ) {
    this.signatures = signatures;
    this.token = token;
  }
}

@unmanaged
export class remove_supported_token_result {
  static encode(message: remove_supported_token_result, writer: Writer): void {}

  static decode(reader: Reader, length: i32): remove_supported_token_result {
    const end: usize = length < 0 ? reader.end : reader.ptr + length;
    const message = new remove_supported_token_result();

    while (reader.ptr < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        default:
          reader.skipType(tag & 7);
          break;
      }
    }

    return message;
  }

  constructor() {}
}

export class add_supported_wrapped_token_arguments {
  static encode(
    message: add_supported_wrapped_token_arguments,
    writer: Writer
  ): void {
    const field_signatures = message.signatures;
    if (field_signatures.length !== 0) {
      for (let i = 0; i < field_signatures.length; ++i) {
        writer.uint32(10);
        writer.bytes(field_signatures[i]);
      }
    }

    const field_token = message.token;
    if (field_token !== null) {
      writer.uint32(18);
      writer.bytes(field_token);
    }
  }

  static decode(
    reader: Reader,
    length: i32
  ): add_supported_wrapped_token_arguments {
    const end: usize = length < 0 ? reader.end : reader.ptr + length;
    const message = new add_supported_wrapped_token_arguments();

    while (reader.ptr < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          message.signatures.push(reader.bytes());
          break;

        case 2:
          message.token = reader.bytes();
          break;

        default:
          reader.skipType(tag & 7);
          break;
      }
    }

    return message;
  }

  signatures: Array<Uint8Array>;
  token: Uint8Array | null;

  constructor(
    signatures: Array<Uint8Array> = [],
    token: Uint8Array | null = null
  ) {
    this.signatures = signatures;
    this.token = token;
  }
}

@unmanaged
export class add_supported_wrapped_token_result {
  static encode(
    message: add_supported_wrapped_token_result,
    writer: Writer
  ): void {}

  static decode(
    reader: Reader,
    length: i32
  ): add_supported_wrapped_token_result {
    const end: usize = length < 0 ? reader.end : reader.ptr + length;
    const message = new add_supported_wrapped_token_result();

    while (reader.ptr < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        default:
          reader.skipType(tag & 7);
          break;
      }
    }

    return message;
  }

  constructor() {}
}

export class remove_supported_wrapped_token_arguments {
  static encode(
    message: remove_supported_wrapped_token_arguments,
    writer: Writer
  ): void {
    const field_signatures = message.signatures;
    if (field_signatures.length !== 0) {
      for (let i = 0; i < field_signatures.length; ++i) {
        writer.uint32(10);
        writer.bytes(field_signatures[i]);
      }
    }

    const field_token = message.token;
    if (field_token !== null) {
      writer.uint32(18);
      writer.bytes(field_token);
    }
  }

  static decode(
    reader: Reader,
    length: i32
  ): remove_supported_wrapped_token_arguments {
    const end: usize = length < 0 ? reader.end : reader.ptr + length;
    const message = new remove_supported_wrapped_token_arguments();

    while (reader.ptr < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          message.signatures.push(reader.bytes());
          break;

        case 2:
          message.token = reader.bytes();
          break;

        default:
          reader.skipType(tag & 7);
          break;
      }
    }

    return message;
  }

  signatures: Array<Uint8Array>;
  token: Uint8Array | null;

  constructor(
    signatures: Array<Uint8Array> = [],
    token: Uint8Array | null = null
  ) {
    this.signatures = signatures;
    this.token = token;
  }
}

@unmanaged
export class remove_supported_wrapped_token_result {
  static encode(
    message: remove_supported_wrapped_token_result,
    writer: Writer
  ): void {}

  static decode(
    reader: Reader,
    length: i32
  ): remove_supported_wrapped_token_result {
    const end: usize = length < 0 ? reader.end : reader.ptr + length;
    const message = new remove_supported_wrapped_token_result();

    while (reader.ptr < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        default:
          reader.skipType(tag & 7);
          break;
      }
    }

    return message;
  }

  constructor() {}
}

export class add_remove_action_hash {
  static encode(message: add_remove_action_hash, writer: Writer): void {
    const field_address = message.address;
    if (field_address !== null) {
      writer.uint32(10);
      writer.bytes(field_address);
    }

    writer.uint32(16);
    writer.uint64(message.nonce);

    const field_contract_id = message.contract_id;
    if (field_contract_id !== null) {
      writer.uint32(26);
      writer.bytes(field_contract_id);
    }
  }

  static decode(reader: Reader, length: i32): add_remove_action_hash {
    const end: usize = length < 0 ? reader.end : reader.ptr + length;
    const message = new add_remove_action_hash();

    while (reader.ptr < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          message.address = reader.bytes();
          break;

        case 2:
          message.nonce = reader.uint64();
          break;

        case 3:
          message.contract_id = reader.bytes();
          break;

        default:
          reader.skipType(tag & 7);
          break;
      }
    }

    return message;
  }

  address: Uint8Array | null;
  nonce: u64;
  contract_id: Uint8Array | null;

  constructor(
    address: Uint8Array | null = null,
    nonce: u64 = 0,
    contract_id: Uint8Array | null = null
  ) {
    this.address = address;
    this.nonce = nonce;
    this.contract_id = contract_id;
  }
}

@unmanaged
export class metadata_object {
  static encode(message: metadata_object, writer: Writer): void {
    writer.uint32(8);
    writer.bool(message.initialized);

    writer.uint32(16);
    writer.uint64(message.nonce);

    writer.uint32(24);
    writer.uint32(message.nb_validators);
  }

  static decode(reader: Reader, length: i32): metadata_object {
    const end: usize = length < 0 ? reader.end : reader.ptr + length;
    const message = new metadata_object();

    while (reader.ptr < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          message.initialized = reader.bool();
          break;

        case 2:
          message.nonce = reader.uint64();
          break;

        case 3:
          message.nb_validators = reader.uint32();
          break;

        default:
          reader.skipType(tag & 7);
          break;
      }
    }

    return message;
  }

  initialized: bool;
  nonce: u64;
  nb_validators: u32;

  constructor(
    initialized: bool = false,
    nonce: u64 = 0,
    nb_validators: u32 = 0
  ) {
    this.initialized = initialized;
    this.nonce = nonce;
    this.nb_validators = nb_validators;
  }
}

@unmanaged
export class validator_object {
  static encode(message: validator_object, writer: Writer): void {}

  static decode(reader: Reader, length: i32): validator_object {
    const end: usize = length < 0 ? reader.end : reader.ptr + length;
    const message = new validator_object();

    while (reader.ptr < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        default:
          reader.skipType(tag & 7);
          break;
      }
    }

    return message;
  }

  constructor() {}
}

@unmanaged
export class wrapped_token_object {
  static encode(message: wrapped_token_object, writer: Writer): void {}

  static decode(reader: Reader, length: i32): wrapped_token_object {
    const end: usize = length < 0 ? reader.end : reader.ptr + length;
    const message = new wrapped_token_object();

    while (reader.ptr < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        default:
          reader.skipType(tag & 7);
          break;
      }
    }

    return message;
  }

  constructor() {}
}

@unmanaged
export class token_object {
  static encode(message: token_object, writer: Writer): void {}

  static decode(reader: Reader, length: i32): token_object {
    const end: usize = length < 0 ? reader.end : reader.ptr + length;
    const message = new token_object();

    while (reader.ptr < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        default:
          reader.skipType(tag & 7);
          break;
      }
    }

    return message;
  }

  constructor() {}
}
