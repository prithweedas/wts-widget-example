'use client'

import {
  unrealisedGainLossLoader,
  UnrealisedGainLossStateManager,
  UnrealisedGainLossWidgetEvents,
  UnrealisedGainLossWidgetUI,
} from "@/widgets/unrealised-gain-loss-widget";

export default function Home() {
  return (
    <main>
      <UnrealisedGainLossStateManager
        for={{ type: "advisor" }}
        onEvent={(event: UnrealisedGainLossWidgetEvents) => {
          console.log(event);
        }}
        loader={unrealisedGainLossLoader}
      >
        <UnrealisedGainLossWidgetUI />
      </UnrealisedGainLossStateManager>
    </main>
  );
}
