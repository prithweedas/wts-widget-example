"use client";
import { ComponentProps, createContext, useReducer } from "react";
import {
  createContextHook,
  WidgetContext,
  WidgetEvent,
  WidgetProps,
  WidgetStateAction,
} from "./widgets-common";
import { useQuery } from "@tanstack/react-query";

// define supporting types

export type UnrealisedGainLossTimeframes = "1d" | "1w" | "1m" | "1y";

export type UnrealisedGainLossFor =
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

// define loader function and types
export type UnrealisedGainLossLoaderInputs = UnrealisedGainLossFor & {
  timeframe: UnrealisedGainLossTimeframes;
};

export async function unrealisedGainLossLoader(
  inputs: UnrealisedGainLossLoaderInputs
) {
  console.log(inputs);
  await new Promise((resolve) => setTimeout(resolve, 3000));
  return {
    unrealisedGainLoss: 0,
    unrealisedGainLossPercentage: 0,
  };
}

// define widget event, state, state update actions and data types

/**
 * Widget events
 *
 * Use this type to define the events that the widget can emit
 * type WidgetEvents = WidgetEvent<"event-one", PayloadType> | WidgetEvent<"event-two", PayloadType>
 */
export type UnrealisedGainLossWidgetEvents = WidgetEvent<
  "view-more",
  undefined
>;

// state
type UnrealisedGainLossState = {
  timeframe: "1d" | "1w" | "1m" | "1y";
};
/**
 * State update actions
 *
 * Use this type to define the events that the widget can emit
 * type WidgetStateActions = UnrealisedGainLossStateActions<"action-one", PayloadType> | UnrealisedGainLossStateActions<"action-two", PayloadType>
 */
type UnrealisedGainLossStateActions = WidgetStateAction<
  "set-timeframe",
  "1d" | "1w" | "1m" | "1y"
>;

// data for the widget
type UnrealisedGainLossData = Awaited<
  ReturnType<typeof unrealisedGainLossLoader>
>;

// define context types and hooks
type UnrealisedGainLossContext = WidgetContext<
  UnrealisedGainLossData | undefined,
  UnrealisedGainLossState,
  UnrealisedGainLossStateActions,
  UnrealisedGainLossWidgetEvents
>;

const UnrealisedGainLossContext = createContext<
  UnrealisedGainLossContext | undefined
>(undefined);

const useUnrealisedGainLossContext = createContextHook(
  UnrealisedGainLossContext
);

// define state reducer for state manager
function useUnrealisedGainLossStateReducer(
  prevState: UnrealisedGainLossState,
  update: UnrealisedGainLossStateActions
) {
  switch (update.type) {
    case "set-timeframe":
      return { ...prevState, timeframe: update.payload };
  }
}

export function UnrealisedGainLossStateManager(
  props: WidgetProps<
    typeof unrealisedGainLossLoader,
    UnrealisedGainLossWidgetEvents
  > & {
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

// define the widget UI
export function UnrealisedGainLossWidgetUI() {
  const context = useUnrealisedGainLossContext();

  if (context.isRefetching) {
    return <p>Refetching...</p>;
  }
  if (context.isLoading) {
    return <p>Loading...</p>;
  }

  if (!context.data) {
    return <></>;
  }

  return (
    <div>
      <p>Absolute G/L: {context.data.unrealisedGainLoss}</p>
      <p>Percentage G/L: {context.data.unrealisedGainLossPercentage}</p>
      <br />
      <br />
      <button
        onClick={() => context.emit({ type: "view-more", payload: undefined })}
      >
        View More
      </button>
      <br />
      <br />
      <button onClick={() => context.refetch()}>Refetch</button>
    </div>
  );
}

// How does this help us as a base for building b2b sdk?

// Let's assemble these pieces as a Client Unrealised G/L Widget

// eslint-disable-next-line @typescript-eslint/no-unused-vars
function ClientUnrealisedGainLossWidget(props: {
  onEvent: ComponentProps<typeof UnrealisedGainLossStateManager>["onEvent"];
  clientId: string;
}) {
  return (
    <UnrealisedGainLossStateManager
      for={{ type: "client", clientId: props.clientId }}
      onEvent={props.onEvent}
      loader={unrealisedGainLossLoader}
    >
      <UnrealisedGainLossWidgetUI />
    </UnrealisedGainLossStateManager>
  );
}
