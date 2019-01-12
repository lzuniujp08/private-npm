<template>
  <div class="index">
    <div class="message">
      {{message.name}} is from {{message.country}}
    </div>
  </div>
</template>
<script>
  export default {
    name: 'gw-message',
    props: {
      message: {
        type: Object,
        default: () => {
          return {
            name: 'lzugis',
            country: 'China'
          };
        }
      }
    },
    data(){
      return {}
    }
  }
</script>
<style lang="scss" scoped>
.message {
  position: absolute;
  bottom: 20px;
  right: 20px;
  padding: 10px;
  background-color: white;
  z-index: 99;
}
</style>
