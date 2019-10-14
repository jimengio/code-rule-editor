import React, { Component } from "react";
import produce from "immer";

export default class ImmerComponent<P, S> extends Component<P, S> {
  async immerState(f: (s: S, p: P) => void): Promise<any> {
    return new Promise((resolve) => {
      this.setState(produce<any>(f), () => {
        resolve();
      });
    });
  }

  async mergeState(f: Partial<S>): Promise<any> {
    let partialState = f;
    let newState = produce((state) => {
      Object.assign(state, partialState);
    });
    return new Promise((resolve) => {
      this.setState(newState, () => {
        resolve();
      });
    });
  }
}
