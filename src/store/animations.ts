import type { Animations } from '$lib/models/cursor-theme';
import { writable } from 'svelte/store';

const store = writable<Animations>([]);

export default store;
