<template>
  <div>
    <div class="section title_section">
      <div class="section_title"><h3>Вид техники</h3></div>
      <div v-if="error" class="error_up_block error">{{ error_text }}</div>
      <div class="types">
        <div class="form_group" v-for="(type, i) in types_items" :key="i">
          <input
            v-model="types_items[i].checked"
            type="checkbox"
            :id="'check' + i"
            @change="setFieldNum(type, true)"
          />
          <label class="check" :for="'check' + i">{{ type.name }}</label>
          <input
            v-if="type.code == 'custom'"
            type="text"
            v-model="types_items[i].custom_field"
          />
          <input
            v-model.number="types_items[i].count"
            type="number"
            @change="setFieldNumExpertise(expertise)"
          /><span class="c_s">{{ type.stuff }}</span>
        </div>
      </div>
    </div>
    <div class="section">
      <div class="form_group short_input" v-if="expertise">
        <input
          v-model="expertise.checked"
          type="checkbox"
          id="expertise"
          @change="setFieldNumExpertise(expertise)"
        />
        <label class="check" for="expertise">{{ expertise.name }}</label>
        <span class="tip" @mouseenter="expertise.tip_show=true" @mouseleave="expertise.tip_show=false"></span>
        <transition name="show_tip">
          <span v-if="expertise.tip_show" class="tip_text">{{expertise.tip}}</span>
        </transition>
      </div>
      <div class="form_group" v-if="pickup && selectedRealization==1">
        <input v-model="pickup.checked" type="checkbox" id="pickup" />
        <label class="check" for="pickup">{{ pickup.name }}</label>
      </div>
    </div>

    <div class="section noborder">
      <button @click="setState(0)" class="btn_main back"><span>←</span>НАЗАД</button>
      <button @click="setData()" class="btn_main next">ДАЛЕЕ</button>
    </div>
  </div>
</template>

<script>
import { mapState, mapMutations, mapGetters, mapActions } from "Vuex";
export default {
  data() {
    return {
      error: false,
      error_text: "Пожалуйста выберите вид техники",
      stuff: "шт.",
      types_items: [],
      metals: null,
      pickup: null,
      expertise: null,
      custom_fild: "",
    };
  },
  computed: {
    ...mapState([
    "types",
    "services",
    "realization",
    "selectedRealization",
    "formState",
  ]),
  ...mapGetters(["GET_ORGANIZATION", "GET_UTIL_WEIGHT_SUM_LIMIT","GET_TYPE_WEIGHT"])
  },

  methods: {
    ...mapActions(["sendData", "saveFormData"]),
    ...mapMutations(["setState", "setDataType"]),
    setTypeArr() {
      this.types.forEach((element) => {
        var item = element;
        if (!item.count) item.count = 0;
        if (!item.checked) item.checked = false;
        if (!item.stuff) item.stuff = this.stuff;
        if (item.code == "custom") item.custom_field = "";
        this.types_items.push(item);
      });
    },

    setServiceArr() {
      this.metals = this.services.metals;
      this.expertise = this.services.expertise;
      this.pickup = this.services.pickup;
    },

    setData() {
      if (this.types_items.find((item) => item.checked) != undefined) {
          var services = {
              expertise: this.expertise,
              pickup: this.pickup
          };
          this.setDataType({
              types: this.types_items,
              services: services,
          });
          if ((this.selectedRealization==0 && this.GET_UTIL_WEIGHT_SUM_LIMIT) || this.selectedRealization>0) {
              var s = 2;
              if (this.pickup.checked)
                s=3;
              this.saveFormData();
              this.setState(s);
          }
          else {
              this.sendData(true);
          }
      } 
      else {
            this.error = true;
      }
    },

    setFieldNum(item, clearError = false) {
      if (item.count < 1 && item.checked) {
        item.count = 1;
      }
      if (clearError) this.error = false;

      this.setFieldNumExpertise(this.expertise);
    },

    setFieldNumExpertise(item, clearError = false) {
      var count = 0;
      this.types_items.forEach((type) => {
        if (type.checked) {
          count += type.count;
        }
      });
      if (item.checked) {
        item.count = count;
      }
      if (clearError) this.error = false;
      this.$forceUpdate();
    },

    getCountKBT() {
      var count = 0;
      var kbt_count = 0
      this.types_items.forEach((type) => {
        if (type.kbt) kbt_count++;
        if (type.checked && type.count>0 && type.kbt) {
          count += type.count;
        }
      });
      if (kbt_count==0) return -1;
      return count;
    },

    checkMinCount() {
      var count = this.getCountKBT();
      var organization = this.GET_ORGANIZATION;
      if (organization.min_kbt && (count>0 || count==-1))
        return true;
      else if (!organization.min_kbt)
        return true;
      else 
        return false;
    }

  },

  mounted() {
    this.setTypeArr();
    this.setServiceArr();
  },
};
</script>

<style>
</style>