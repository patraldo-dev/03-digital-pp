<script>
	/**
	 * Multiverse Viewer Component
	 * Displays LoRA-generated Antoine scenes with navigation
	 */

	export let scenes = [];
	export let autoPlay = false;
	export let intervalMs = 5000;

	let currentIndex = 0;
	let isPlaying = false;
	let playInterval;

	function nextScene() {
		currentIndex = (currentIndex + 1) % scenes.length;
	}

	function prevScene() {
		currentIndex = (currentIndex - 1 + scenes.length) % scenes.length;
	}

	function togglePlay() {
		if (isPlaying) {
			clearInterval(playInterval);
			isPlaying = false;
		} else {
			isPlaying = true;
			playInterval = setInterval(nextScene, intervalMs);
		}
	}

	function goToScene(index) {
		currentIndex = index;
		if (isPlaying) {
			clearInterval(playInterval);
			isPlaying = false;
		}
	}

	$: if (autoPlay && scenes.length > 0) {
		togglePlay();
	}
</script>

<div class="multiverse-viewer">
	{#if scenes.length > 0}
		<div class="scene-display">
			{#if scenes[currentIndex].type === 'image'}
				<img src={scenes[currentIndex].src} alt={scenes[currentIndex].title} class="scene-image" loading="lazy" />
			{:else if scenes[currentIndex].type === 'video'}
				<video src={scenes[currentIndex].src} class="scene-video" controls loop playsinline></video>
			{/if}

			<div class="scene-overlay">
				<h3 class="scene-title">{scenes[currentIndex].title}</h3>
				{#if scenes[currentIndex].description}
					<p class="scene-description">{scenes[currentIndex].description}</p>
				{/if}
				{#if scenes[currentIndex].episode}
					<span class="episode-badge">Episodio {scenes[currentIndex].episode}</span>
				{/if}
			</div>
		</div>

		<div class="viewer-controls">
			<button onclick={prevScene} class="nav-btn" aria-label="Previous scene">←</button>
			<button onclick={togglePlay} class="play-btn" aria-label={isPlaying ? 'Pause' : 'Play'}>
				{isPlaying ? '⏸' : '▶'}
			</button>
			<button onclick={nextScene} class="nav-btn" aria-label="Next scene">→</button>
		</div>

		<div class="scene-thumbnails">
			{#each scenes as scene, index}
				<button onclick={() => goToScene(index)} class="thumbnail {index === currentIndex ? 'active' : ''}" aria-label={`Go to scene ${index + 1}`}>
					{#if scene.type === 'image'}
						<img src={scene.thumbnail || scene.src} alt={scene.title} />
					{:else}
						<div class="video-thumbnail">🎬</div>
					{/if}
				</button>
			{/each}
		</div>

		<div class="progress-indicator">{currentIndex + 1} / {scenes.length}</div>
	{:else}
		<div class="empty-state">
			<p>No scenes available yet.</p>
			<p class="empty-subtext">Coming soon: Antoine's multiverse adventures</p>
		</div>
	{/if}
</div>

<style>
	.multiverse-viewer {
		max-width: 1200px;
		margin: 0 auto;
		font-family: 'JetBrains Mono', monospace;
	}

	.scene-display {
		position: relative;
		width: 100%;
		aspect-ratio: 16/9;
		background: #0a0a0a;
		border-radius: 12px;
		overflow: hidden;
		box-shadow: 0 10px 40px rgba(0,0,0,0.4);
	}

	.scene-image, .scene-video {
		width: 100%;
		height: 100%;
		object-fit: contain;
	}

	.scene-overlay {
		position: absolute;
		bottom: 0;
		left: 0;
		right: 0;
		padding: 2rem;
		background: linear-gradient(transparent, rgba(0,0,0,0.9));
		color: #fff;
	}

	.scene-title {
		font-size: 1.5rem;
		margin: 0 0 0.5rem 0;
		font-weight: 700;
	}

	.scene-description {
		font-size: 1rem;
		opacity: 0.9;
		margin: 0 0 1rem 0;
		line-height: 1.6;
	}

	.episode-badge {
		display: inline-block;
		background: #C94C35;
		color: #fff;
		padding: 0.25rem 0.75rem;
		border-radius: 4px;
		font-size: 0.875rem;
		font-weight: 600;
	}

	.viewer-controls {
		display: flex;
		justify-content: center;
		gap: 1rem;
		margin-top: 1.5rem;
	}

	.nav-btn, .play-btn {
		background: #1a1a1a;
		color: #fff;
		border: 2px solid #333;
		padding: 0.75rem 1.5rem;
		border-radius: 8px;
		font-size: 1.25rem;
		cursor: pointer;
		transition: all 0.2s;
		font-family: inherit;
	}

	.nav-btn:hover, .play-btn:hover {
		background: #C94C35;
		border-color: #C94C35;
	}

	.scene-thumbnails {
		display: flex;
		gap: 0.5rem;
		margin-top: 1.5rem;
		overflow-x: auto;
		padding: 0.5rem 0;
	}

	.thumbnail {
		flex-shrink: 0;
		width: 120px;
		height: 68px;
		border-radius: 6px;
		overflow: hidden;
		border: 2px solid transparent;
		cursor: pointer;
		transition: all 0.2s;
		background: #1a1a1a;
	}

	.thumbnail.active {
		border-color: #C94C35;
	}

	.thumbnail:hover {
		transform: scale(1.05);
	}

	.thumbnail img {
		width: 100%;
		height: 100%;
		object-fit: cover;
	}

	.video-thumbnail {
		width: 100%;
		height: 100%;
		display: flex;
		align-items: center;
		justify-content: center;
		font-size: 1.5rem;
	}

	.progress-indicator {
		text-align: center;
		margin-top: 1rem;
		color: #666;
		font-size: 0.875rem;
	}

	.empty-state {
		text-align: center;
		padding: 4rem 2rem;
		background: #1a1a1a;
		border-radius: 12px;
		color: #888;
	}

	.empty-subtext {
		font-size: 0.875rem;
		margin-top: 0.5rem;
		opacity: 0.7;
	}

	@media (max-width: 768px) {
		.scene-display { aspect-ratio: 4/3; }
		.scene-title { font-size: 1.25rem; }
		.thumbnail { width: 80px; height: 45px; }
	}
</style>
