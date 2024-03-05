<script lang="ts">
  export let src = '';
  export let alt = '';
  export let height = '10rem';
  export let opacity = '0.4';
</script>

<figure class="bg-img" style={`height: ${height}; opacity: ${opacity}`}>
  <img {src} {alt} />
</figure>

<style>
  .bg-img {
    width: 100vw;
    position: absolute;
    left: 0;
    top: 0;
    margin: 0;
    z-index: -1;
    display: block;
    opacity: 0.4;
  }
  .bg-img:after {
    content: '';
    position: absolute;
    left: 0;
    right: 0;
    bottom: 0;
    height: 80%;
    background: linear-gradient(0deg, rgba(255, 255, 255, 1) 0%, rgba(255, 255, 255, 0) 100%);
  }
  .bg-img img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
</style>
