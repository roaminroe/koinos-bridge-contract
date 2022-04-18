import { object_space, privilege, System } from "koinos-sdk-as";

const REENNTRACY_GUARD_SPACE_ID = 100001;
const REENNTRACY_GUARD_KEY = new Uint8Array(0);

export class ReentrancyGuard {
  private _space: object_space;

  constructor(contractId: Uint8Array) {
    this._space = new object_space(false, contractId, REENNTRACY_GUARD_SPACE_ID);

    const callerData = System.getCaller();

    // if a contract is called after the guard enablement and exits with a 0 code
    // the transaction won't be reverted, the guard will be stuck
    // so if caller is null, reset the guard
    // (this means that in the case above, only a user can unlock the guard, not a contract)
    if (callerData.caller == null) {
      this.reset();
    }

    this.check();
    this.set();
  }

  check(): void {
    const guard = System.getBytes(this._space, REENNTRACY_GUARD_KEY);

    // if guard is triggered, the tx reversion will reset it, so no need to do it
    System.require(guard == null, 'ReentrancyGuard: reentrant call');
  }

  set(): void {
    System.putBytes(this._space, REENNTRACY_GUARD_KEY, REENNTRACY_GUARD_KEY);
  }

  reset(): void {
    System.removeObject(this._space, REENNTRACY_GUARD_KEY);
  }
}
