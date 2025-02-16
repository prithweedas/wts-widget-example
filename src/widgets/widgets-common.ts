import {
  FetchStatus,
  QueryObserverResult,
  RefetchOptions,
} from "@tanstack/react-query";
import { ActionDispatch, Context, ReactNode, useContext } from "react";

export type WidgetStateAction<Type extends string, Payload = undefined> = {
  type: Type;
  payload: Payload;
};

export type WidgetContext<
  Data,
  State,
  StateAction extends WidgetStateAction<string, unknown>,
  Event extends WidgetEvent = WidgetEvent
> = {
  fetchStatus: FetchStatus;
  status: "error" | "success" | "pending";
  isFetching: boolean;
  isLoading: boolean;
  isPending: boolean;
  isRefetching: boolean;
  data: Data;
  state: State;
  emit: WidgetEventListener<Event>;
  refetch: (
    options?: RefetchOptions
  ) => Promise<QueryObserverResult<Data, Error>>;
  dispatch: ActionDispatch<[update: StateAction]>;
};

export function createContextHook<T>(context: Context<T | undefined>) {
  return function useContextHook() {
    const value = useContext(context);
    if (value === undefined) {
      throw new Error("useContext must be used within a Provider with a value");
    }
    return value;
  };
}

export type WidgetEvent<Type extends string = string, Payload = unknown> = {
  type: Type;
  payload: Payload;
};

export type WidgetEventListener<Event extends WidgetEvent = WidgetEvent> = (
  event: Event
) => void | Promise<void>;

export type WidgetProps<
  // eslint-disable-next-line @typescript-eslint/no-unsafe-function-type
  Loader extends Function,
  Event extends WidgetEvent
> = {
  children: ReactNode;
  loader: Loader;
  onEvent: (event: Event) => void | Promise<void>;
};
