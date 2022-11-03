<script lang="ts">
	export let src: {
		mobile: string;
		desktop: string;
	};
	export let alt = '';
</script>

<picture>
	<source srcset={src.desktop} media="(min-width: 768px)" />
	<img src={src.mobile} {alt} />
</picture>
