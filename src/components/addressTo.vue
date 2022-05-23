<template>
  <div>
    <div class="section title_section">
        <div class="section_title"><h3>Адрес вывоза</h3></div>
        <div class="address_wrapper">
          <div class="form_group placeholder mb-30 address" v-if="addr" :class="{error: addr.error, disabled: pickup.checked, short:this.GET_ORGANIZATION.largeAddres}">
              <input :disabled="pickup.checked" v-model="addr.value" type="text" id="address" @change="addressChange($event.target.value)" @focus="addr.error=false">
              <label v-if="addr.value==''" for="address">{{setNameField(addr)}}</label>
          </div>
          <div class="form_group placeholder mb-30 house" v-if="addr && this.GET_ORGANIZATION.largeAddres" :class="{error: addr.house.error, disabled: pickup.checked}">
              <input :disabled="pickup.checked" v-model="addr.house.value" type="text" id="house" @change="addressChange($event.target.value)" @focus="addr.house.error=false">
              <label v-if="addr.house.value==''" for="house">{{setNameField(addr.house)}}</label>
          </div>
          <div class="form_group placeholder mb-30 entrance" v-if="addr && this.GET_ORGANIZATION.largeAddres" :class="{error: addr.entrance.error, disabled: pickup.checked}">
              <input :disabled="pickup.checked" v-model="addr.entrance.value" type="text" id="entrance" @change="addressChange($event.target.value)" @focus="addr.entrance.error=false">
              <label v-if="addr.entrance.value==''" for="entrance">{{setNameField(addr.entrance)}}</label>
          </div>
          <div class="form_group placeholder mb-30 comment" v-if="addr && this.GET_ORGANIZATION.largeAddres" :class="{error: addr.comment.error, disabled: pickup.checked}">
              <input :disabled="pickup.checked" v-model="addr.comment.value" type="text" id="comment" @change="addressChange($event.target.value)" @focus="addr.comment.error=false">
              <label v-if="addr.comment.value==''" for="comment">{{setNameField(addr.comment)}}</label>
          </div>
        </div>
        <div class="form_group" v-if="pickup">
          <input v-model="pickup.checked" type="checkbox" id="pickup" @change="pickupChange()"/>
          <label class="check" for="pickup">Самостоятельная доставка</label>
        </div>
    </div>
    <div class="section section_title">
        <div class="section_title"><h3>Место транспортировки</h3></div>
        <div class="form_group" v-for="(place, i) in places" :key="i" :class="{disabled: pickup.checked}">
            <input :disabled="pickup.checked" v-model="placeSelected" type="radio" :value="i" :id="'organization'+i">
            <label class="check" :for="'organization'+i">{{place.name}}</label>
      </div>
    </div>
    <div class="section noborder">
      <button @click="setState(1)" class="btn_main back"><span>←</span>НАЗАД</button>
      <button @click="setData()" class="btn_main next">ДАЛЕЕ</button>
    </div>

  </div>
</template>

<script>
import {mapState, mapMutations, mapGetters, mapActions} from "Vuex"
import { loadYmap } from 'vue-yandex-maps'
export default {
    computed:{
      ...mapState(["address", "transportPlace", "selectedPlace", "services"]),
      ...mapGetters(["GET_ORGANIZATION"]),
    },
    data () {
        return {
            addr:null,
            selected: false,
            places:[],
            placeSelected:0,
            pickup:null,
            yamapSettings: {
              apiKey: '726bed1d-6215-4a54-9276-6d7231245ba3',
              lang: 'ru_RU',
              coordorder: 'latlong',
              version: '2.1'
            },
            ymaps: null,
        }
    },
    methods:{
         ...mapMutations(["setState", "setDataAddresTo"]),
         ...mapActions(["saveFormData"]),
          setNameField(item) {
            if (item.error && item.error_text!=undefined && item.error_text!="") return item.error_text
            return item.name
        },
        setData() {
            if (this.addr.value.length>0 || this.pickup.checked) {
                this.setDataAddresTo({address:this.addr, selectedPlace: Number.parseInt(this.placeSelected)});
                this.saveFormData();
                this.setState(3);
            }
            else {
              this.addr.error=true;
            }
        },
        addressChange(value) {
          this.selected=false;
          this.$forceUpdate()
        },

        pickupChange() {
          this.addr.value='';;
          this.addr.entrance.value='';
          this.addr.house.value='';
        }
    },
    async mounted() {
       this.addr = this.address;
       if (!this.addr.value) this.addr.value="";

       this.transportPlace.forEach((element, i) => {
           var item = element;
           if (!item.checked) item.checked=false
           else this.placeSelected=i;
           this.places.push(item);
       });
       this.placeSelected=this.selectedPlace;
       this.pickup=this.services.pickup;

       await loadYmap({ settings: this.yamapSettings, debug: true });
       this.ymaps=ymaps;
       var suggestView = new ymaps.SuggestView('address', {results: 10});
       suggestView.events.add("select", (e) => {
         this.selected=true;
         this.addr.value=e.get("item").value;
       })
    }
}
</script>

<style>

</style>