<template>
  <div class="result">
    <div class="section title_section section-p">
        <div class="result">
          <div class="result_group">
            <div class="result_title">{{typeRealization}}</div>
            <div class="result_price">{{moneyFormat(utilization)}} руб.</div>
          </div>
          <div class="result_group">
            <div class="result_title">Стоимость логистики</div>
            <div class="result_price">{{logisticPrice()}}</div>
          </div>
          <div class="result_group">
            <div class="result_title">Стоимость техэкспертизы</div>
            <div class="result_price">{{moneyFormat(expertize)}} руб.</div>
          </div>
          <div class="result_group mb-0">
            <div class="result_title bold">Итого</div>
            <div class="result_price bold">{{resultSum()}}</div>
          </div>
        </div>
    </div>
    <div class="section noborder center">
      <button @click="setState(4)" class="btn_main next" :class="{loading: setLoadingStatus}">ОФОРМИТЬ ЗАЯВКУ</button>
    </div>
  </div>
</template>

<script>
import {mapState, mapGetters, mapActions, mapMutations} from "Vuex"
export default {
  data () {
    return {
      realiztion:[
        "Стоимость утилизации",
        "Стоимость оборудования",
      ],
      utilization: 0,
      logistic: 0,
      expertize: 0
    }
  },
  computed: {
    ...mapState(["selectedRealization", "setLoadingStatus", "services", "selectedPlace"]),
    ...mapGetters(["GET_COST_UTILIZATION", "GET_COST_EXPERTISE", "GET_COST_LOGISTIC"]),
    typeRealization() {
      if (this.selectedRealization==1)
        return this.realiztion[1]
      else return this.realiztion[0]
    }
  },
  methods: {
    ...mapActions(["sendData"]),
    ...mapMutations(["setState"]),
    moneyFormat(n) {
      return parseFloat(n).toFixed(2).replace(/(\d)(?=(\d{3})+\.)/g, "$1 ").replace(".",",");
    },
    logisticPrice() {
      if (this.services.pickup.checked) return 0 + ",00 руб.";
      var price=this.GET_COST_LOGISTIC;
      if (this.selectedPlace==3) return "требуется уточнение маршрута"
      return this.moneyFormat(price) + " руб."
    },
    resultSum() {
      var sum = this.utilization + this.expertize + this.logistic;
      return this.moneyFormat(sum) + " руб."
    },
  },
  mounted () {
    this.utilization = this.GET_COST_UTILIZATION(false);
    this.expertize = this.GET_COST_EXPERTISE;
    this.logistic = this.GET_COST_LOGISTIC;
  }
}
</script>

<style>

</style>