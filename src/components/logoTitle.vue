<template>
  <div class="calc_title">
      <div class="calc_title_logo"><img :src="logo" alt="logo"></div>
      <div class="title"><h2>{{Title}}</h2></div>
  </div>
</template>

<script>
import {mapState} from "vuex";
export default {
    data () {
        return {
            title: "Форма заказа",
            successTitle: "Спасибо за оформленную заявку",
            logo: require("../assets/logo-1.svg")
        }
    },
    computed:{
        ...mapState(["formState"]),
        Title() {
            if (this.formState==5) return this.successTitle;
            return this.title;
        }
    }
}
</script>

<style>

</style>