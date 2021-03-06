import type { AppRouter } from "./index";
import type {
  inferProcedureOutput,
  inferProcedureInput,
  inferSubscriptionOutput,
  inferHandlerInput,
} from "@trpc/server";

export type TQuery = keyof AppRouter["_def"]["queries"];
export type TMutation = keyof AppRouter["_def"]["mutations"];
export type TSubscription = keyof AppRouter["_def"]["subscriptions"];

export type InferQueryOutput<TRouteKey extends TQuery> = inferProcedureOutput<
  AppRouter["_def"]["queries"][TRouteKey]
>;

export type InferQueryInput<TRouteKey extends TQuery> = inferProcedureInput<
  AppRouter["_def"]["queries"][TRouteKey]
>;

export type InferQueryHandlerInput<TRouteKey extends TQuery> =
  inferHandlerInput<AppRouter["_def"]["queries"][TRouteKey]>;

export type InferMutationOutput<TRouteKey extends TMutation> =
  inferProcedureOutput<AppRouter["_def"]["mutations"][TRouteKey]>;

export type InferMutationInput<TRouteKey extends TMutation> =
  inferProcedureInput<AppRouter["_def"]["mutations"][TRouteKey]>;

export type InferSubscriptionOutput<TRouteKey extends TSubscription> =
  inferProcedureOutput<AppRouter["_def"]["subscriptions"][TRouteKey]>;

export type InferAsyncSubscriptionOutput<TRouteKey extends TSubscription> =
  inferSubscriptionOutput<AppRouter, TRouteKey>;

export type InferSubscriptionInput<TRouteKey extends TSubscription> =
  inferProcedureInput<AppRouter["_def"]["subscriptions"][TRouteKey]>;
