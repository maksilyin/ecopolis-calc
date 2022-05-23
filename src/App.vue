<template>
  <div id="calculator">
    <div class="calc_wrapper">
      <logo></logo>
      <organization v-if="formState==0"></organization>
      <type v-else-if="formState==1"></type>
      <addressTo v-else-if="formState==2"></addressTo>
      <result v-else-if="formState==3"></result>
      <requisites v-else-if="formState==4"></requisites>
      <docsPage v-else-if="formState==5"></docsPage>
      <div class="section after" :class="{'pt-0':formState!=5}">Для получения более подробной информации звоните <a href="tel:+74996493939">+7 (499) 649-39-39</a></div>
    </div>
  </div>
</template>

<script>
import {mapState, mapMutations} from "Vuex"
import logo from "./components/logoTitle"
import type from "./components/typeForm"
import addressTo from "./components/addressTo"
import organization from "./components/organization"
import result from "./components/result"
import docsPage from "./components/docsPage"
import requisites from "./components/requisites"
export default {
  components: {
    logo, type, organization, addressTo, result, docsPage, requisites
  },
  name: 'app',
  data () {
    return {
      num: 0,
      state: 1,
      check_1:null,
    }
  },
  methods: mapMutations(['setTypes', 'setParams']),
  computed: mapState(["formState"]),
  beforeMount() {
    if (typeof custom_types !== undefined && custom_types.length > 0) {
       this.setTypes(custom_types);
    }
  },
  mounted() {
    var dataParam = {};
    if (typeof params !== undefined) {dataParam.bx_params=params}
    if (typeof sessid !== undefined) {dataParam.sessid=sessid}
    if (typeof send !== undefined) {dataParam.bx_send=send}
    this.setParams(dataParam)
  }
}
</script>

<style lang="scss">

</style>
