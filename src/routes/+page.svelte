<script lang="ts">
	import Counter from './Counter.svelte';
	import welcome from '$lib/images/svelte-welcome.webp';
	import welcome_fallback from '$lib/images/svelte-welcome.png';
	import type { PageData } from './$types';

	export let data: PageData;

	let loadedData = [];
	async function loadData() {
		const { data: result } = await data.supabase.from('test').select('*').limit(20);
		loadedData = result;
	}

	$: if (data.session) {
		loadData();
	}
</script>

<svelte:head>
	<title>Home</title>
	<meta name="description" content="Svelte demo app" />
</svelte:head>

 
{#if data.session}
  <p>client-side data fetching with RLS</p>
  <pre>{JSON.stringify(loadedData, null, 2)}</pre>
{/if}

<style>
	section {
		display: flex;
		flex-direction: column;
		justify-content: center;
		align-items: center;
		flex: 0.6;
	}

	h1 {
		width: 100%;
	}

	.welcome {
		display: block;
		position: relative;
		width: 100%;
		height: 0;
		padding: 0 0 calc(100% * 495 / 2048) 0;
	}

	.welcome img {
		position: absolute;
		width: 100%;
		height: 100%;
		top: 0;
		display: block;
	}
</style>
