// See https://kit.svelte.dev/docs/types#app
// for information about these interfaces

/// <reference path="../worker-configuration.d.ts" />
/// <reference types="@cloudflare/workers-types" />

interface Env {
	DB: D1Database;
	CONTACT_KV: KVNamespace;
	VECTORIZE: VectorizeIndex;
	AI: Ai;
	ASSETS: Fetcher;
	MAILGUN_DOMAIN: string;
	CONTACT_EMAIL: string;
	MAILGUN_FROM_EMAIL: string;
	MAILGUN_API_KEY: string;
	SEARCH_ADMIN_TOKEN: string;
}

declare global {
	namespace App {
		// interface Error {}
		interface Locals {
			lang: string;
		}
		// interface PageData {}
		// interface PageState {}
		interface Platform {
			env: Env;
			context: ExecutionContext;
			caches: CacheStorage;
		}
	}
}

export {};
