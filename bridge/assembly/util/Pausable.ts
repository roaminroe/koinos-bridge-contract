import { object_space, System } from "koinos-sdk-as";

const PAUSABLE_SPACE_ID = 1001;
const PAUSABLE_KEY = new Uint8Array(0);

export class Pausable {
  private _space: object_space;

  constructor(contractId: Uint8Array) {
    this._space = new object_space(false, contractId, PAUSABLE_SPACE_ID);
  }

  paused(): bool {
    return System.getBytes(this._space, PAUSABLE_KEY) != null;
  }

  whenNotPaused(): void {
    System.require(!this.paused(), 'Pausable: paused', 1);
  }

  whenPaused(): void {
    System.require(this.paused(), 'Pausable: not paused', 1);
  }

  setPause(pause: bool): void {
    if (pause == true) {
      this.pause();
    } else {
      this.unpause();
    }
  }

  pause(): void {
    System.putBytes(this._space, PAUSABLE_KEY, PAUSABLE_KEY);
  }

  unpause(): void {
    System.removeObject(this._space, PAUSABLE_KEY);
  }
}
