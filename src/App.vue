<template>
  <div>
    <druktemeter :value="45" :reset="true"></druktemeter>
  </div>
</template>

<script>

import Druktemeter from './components/Druktemeter';

export default {
  name: 'App',
  components: {Druktemeter}
};

</script>

<style>

</style>
