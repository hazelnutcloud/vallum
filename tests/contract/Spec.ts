export class Spec {
  private value: number;
  constructor() {
    this.value = 0;
  }
  increment() {
    this.value++;
  }
  getValue() {
    return this.value;
  }
}
