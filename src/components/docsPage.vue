<template>
  <div>
      <div v-if="linkData">
        <div v-for="(link, i) in linkData.links" :key="i" class="doc_link"><a :href="link.link">{{link.name}}</a></div>
      </div>
      <div v-if="GET_CALLBACK" class="callback_message">
        <p>Спасибо за ваш заказ!</p>
        <p>Оператор свяжется с вами ближайшее время</p>
      </div>
  </div>
</template>

<script>
import {mapState, mapGetters} from 'vuex'
export default {
    computed: {
        ...mapState(["linkData"]),
        ...mapGetters(["GET_CALLBACK", "GET_UTIL_WEIGHT_SUM_LIMIT"]),
    },
    mounted (){
        console.log(this.linkData);
    }
}
</script>

<style>

</style>