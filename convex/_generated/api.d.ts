/* eslint-disable */
/**
 * Generated `api` utility.
 *
 * THIS CODE IS AUTOMATICALLY GENERATED.
 *
 * To regenerate, run `npx convex dev`.
 * @module
 */

import type * as achievement_memories from "../achievement_memories.js";
import type * as achievements from "../achievements.js";
import type * as debug from "../debug.js";
import type * as debugUsers from "../debugUsers.js";
import type * as demon from "../demon.js";
import type * as files from "../files.js";
import type * as fixRoles from "../fixRoles.js";
import type * as goals from "../goals.js";
import type * as memories from "../memories.js";
import type * as migrate from "../migrate.js";
import type * as participation_memories from "../participation_memories.js";
import type * as participations from "../participations.js";
import type * as projects from "../projects.js";
import type * as seed from "../seed.js";
import type * as users from "../users.js";

import type {
  ApiFromModules,
  FilterApi,
  FunctionReference,
} from "convex/server";

declare const fullApi: ApiFromModules<{
  achievement_memories: typeof achievement_memories;
  achievements: typeof achievements;
  debug: typeof debug;
  debugUsers: typeof debugUsers;
  demon: typeof demon;
  files: typeof files;
  fixRoles: typeof fixRoles;
  goals: typeof goals;
  memories: typeof memories;
  migrate: typeof migrate;
  participation_memories: typeof participation_memories;
  participations: typeof participations;
  projects: typeof projects;
  seed: typeof seed;
  users: typeof users;
}>;

/**
 * A utility for referencing Convex functions in your app's public API.
 *
 * Usage:
 * ```js
 * const myFunctionReference = api.myModule.myFunction;
 * ```
 */
export declare const api: FilterApi<
  typeof fullApi,
  FunctionReference<any, "public">
>;

/**
 * A utility for referencing Convex functions in your app's internal API.
 *
 * Usage:
 * ```js
 * const myFunctionReference = internal.myModule.myFunction;
 * ```
 */
export declare const internal: FilterApi<
  typeof fullApi,
  FunctionReference<any, "internal">
>;

export declare const components: {};
