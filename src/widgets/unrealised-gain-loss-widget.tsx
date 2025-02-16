"use client";
import { createContext, useReducer } from "react";
import {
  createContextHook,
  WidgetContext,
  WidgetEvent,
  WidgetProps,
  WidgetStateUpdate,
} from "./widgets-common";
import { useQuery } from "@tanstack/react-query";

export type UnrealisedGainLossWidgetEvents = WidgetEvent<'view-more', undefined>;

type UnrealisedGainLossContext = WidgetContext<
  Awaited<ReturnType<typeof unrealisedGainLossLoader>> | undefined,
  { timeframe: "1d" | "1w" | "1m" | "1y" },
  UnrealisedGainLossStateUpdate,
  UnrealisedGainLossWidgetEvents
>;

const UnrealisedGainLossContext = createContext<
  UnrealisedGainLossContext | undefined
>(undefined);

const useUnrealisedGainLossContext = createContextHook(
  UnrealisedGainLossContext
);

type UnrealisedGainLossTimeframes = "1d" | "1w" | "1m" | "1y";

type UnrealisedGainLossFor =
  | {
      type: "advisor";
    }
  | {
      type: "client";
      clientId: string;
    }
  | {
      type: "account";
      accountId: string;
    };

type UnrealisedGainLossLoaderInputs = UnrealisedGainLossFor & {
  timeframe: UnrealisedGainLossTimeframes;
};

export async function unrealisedGainLossLoader(
  inputs: UnrealisedGainLossLoaderInputs
) {
  console.log(inputs);
  await new Promise((resolve) => setTimeout(resolve, 10000));
  return {
    unrealisedGainLoss: 0,
    unrealisedGainLossPercentage: 0,
  };
}

type UnrealisedGainLossState = {
  timeframe: "1d" | "1w" | "1m" | "1y";
};

type UnrealisedGainLossStateUpdate = WidgetStateUpdate<
  "set-timeframe",
  "1d" | "1w" | "1m" | "1y"
>;

function useUnrealisedGainLossStateReducer(
  prevState: UnrealisedGainLossState,
  update: UnrealisedGainLossStateUpdate
) {
  switch (update.type) {
    case "set-timeframe":
      return { ...prevState, timeframe: update.payload };
  }
}

export function UnrealisedGainLossStateManager(
  props: WidgetProps<typeof unrealisedGainLossLoader, UnrealisedGainLossWidgetEvents> & {
    for: UnrealisedGainLossFor;
  }
) {
  const [state, dispatch] = useReducer(useUnrealisedGainLossStateReducer, {
    timeframe: "1d",
  } as UnrealisedGainLossState);
  const { children, loader, onEvent } = props;
  const {
    data,
    refetch,
    fetchStatus,
    status,
    isFetching,
    isLoading,
    isPending,
    isRefetching,
  } = useQuery({
    queryKey: ["unrealised-gain-loss", state],
    queryFn: () => {
      return loader({
        ...props.for,
        timeframe: state.timeframe,
      });
    },
  });

  return (
    <UnrealisedGainLossContext.Provider
      value={{
        fetchStatus,
        status,
        isFetching,
        isLoading,
        isPending,
        isRefetching,
        data,
        state,
        emit: onEvent,
        refetch,
        dispatch,
      }}
    >
      {children}
    </UnrealisedGainLossContext.Provider>
  );
}

export function UnrealisedGainLossWidgetUI() {
  const context = useUnrealisedGainLossContext();

  if(!context.data) {
    return <></>
  }

  return (
    <div>
      <p>Absolute G/L: {context.data.unrealisedGainLoss}</p>
      <p>Percentage G/L: {context.data.unrealisedGainLossPercentage}</p>
      <button onClick={() => context.emit({type: 'view-more', payload: undefined})}>View More</button>
    </div>
  );
}