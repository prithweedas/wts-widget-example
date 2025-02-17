import React from "react";
import {
  UnrealisedGainLossFor,
  unrealisedGainLossLoader,
  UnrealisedGainLossStateManager,
  UnrealisedGainLossWidgetEvents,
  UnrealisedGainLossWidgetUI,
} from "@/widgets/unrealised-gain-loss-widget";
import { createRoot, Root } from "react-dom/client";
import { QueryClientProvider } from "@tanstack/react-query";
import { getQueryClient } from "@/utils/providers";

class UnrealisedGainLossWidgetWrapper extends HTMLElement {
  shadowRoot: ShadowRoot;
  mountPoint: HTMLDivElement;
  root: Root;

  constructor() {
    super();
    this.shadowRoot = this.attachShadow({ mode: "open" });
    this.mountPoint = document.createElement("div");
    this.shadowRoot.appendChild(this.mountPoint);
    this.root = createRoot(this.mountPoint);
  }

  load(glFor: UnrealisedGainLossFor) {
    this.render(glFor);
  }

  handleEvent = (event: UnrealisedGainLossWidgetEvents) => {
    const customEvent = new CustomEvent(event.type, {
      detail: event.payload,
    });
    this.dispatchEvent(customEvent);
  };

  render(glFor: UnrealisedGainLossFor) {
    this.root.render(
      <QueryClientProvider client={getQueryClient()}>
        <UnrealisedGainLossStateManager
          for={glFor}
          onEvent={this.handleEvent}
          loader={unrealisedGainLossLoader}
        >
          <UnrealisedGainLossWidgetUI />
        </UnrealisedGainLossStateManager>
      </QueryClientProvider>
    );
  }
}

customElements.define(
  "unrealised-gain-loss-widget-wrapper",
  UnrealisedGainLossWidgetWrapper
);


// How to use this
// in HTML
// <unrealised-gain-loss-widget-wrapper></unrealised-gain-loss-widget-wrapper>
// in JS
// const widget = document.querySelector('unrealised-gain-loss-widget-wrapper');
// widget.load({ type: 'advisor' });
// widget.addEventListener('view-more', (event) => {
//   console.log(event.detail);
// });