import { object_space, System } from "koinos-sdk-as";

const REENNTRACY_GUARD_SPACE_ID = 1000;
const REENNTRACY_GUARD_KEY = new Uint8Array(0);

export class ReentrancyGuard {
  private _space: object_space;

  constructor(contractId: Uint8Array) {
    this._space = new object_space(false, contractId, REENNTRACY_GUARD_SPACE_ID);

    this.check();
    this.set();
  }

  private check(): void {
    System.require(System.getBytes(this._space, REENNTRACY_GUARD_KEY) == null, 'ReentrancyGuard: reentrant call', 1);
  }

  private set(): void {
    System.putBytes(this._space, REENNTRACY_GUARD_KEY, REENNTRACY_GUARD_KEY);
  }

  reset(): void {
    System.removeObject(this._space, REENNTRACY_GUARD_KEY);
  }
}
