<template>
  <div>
      <div class="section title_section">
        <div class="section_title"><h3>Реквизиты</h3></div>
        <div class="form_group placeholder" v-for="(requisit, i) in requisitesArr" :key="i">
            <input v-if="requisit.name=='ИНН'" :disabled="loadingStatus==3" @input="checkOrganization($event)" v-model="requisitesArr[i].value" type="text" :id="'requisit'+i" @change="$forceUpdate()">
            <input v-else v-model="requisitesArr[i].value" type="text" :id="'requisit'+i" @change="$forceUpdate()">
            <label v-if="requisitesArr[i].value==''" :for="'requisit'+i">{{requisit.name}}<span v-if="requisit.placeholder"> {{requisit.placeholder}}</span></label>
      </div>
    </div>
     <div class="section noborder center">
      <button @click="setData()" class="btn_main next" :class="{loading: setLoadingStatus}">ДАЛЕЕ</button>
    </div>
  </div>
</template>

<script>
import {mapState, mapMutations, mapActions} from "Vuex"
export default {
    data () {
        return {
            requisitesArr:[],
        }
    },
    computed: mapState(["requisites","loadingStatus","setLoadingStatus"]),
    methods: {
        ...mapActions(["getOrgData","sendData"]),
        ...mapMutations(["setRequisitesData"]),
        checkOrganization($event) {
            var inn = $event.target.value;
            if (inn.length==10) {
                this.getOrgData(inn).then((data)=>{
                    this.$forceUpdate();
                    if (data.suggestions.length>0) {
                        this.setRequisites(data);
                    }
                })
            }
        },
        setRequisites (requisites) {
            for (let index = 0; index < this.requisitesArr.length; index++) {

                switch (this.requisitesArr[index].code) {
                    case "name":
                        this.requisitesArr[index].value=requisites.suggestions[0].value;
                        break;
                    case "managment":
                        this.requisitesArr[index].value=requisites.suggestions[0].data.management.name;
                        break;
                    case "authority":
                      //  this.requisitesArr[index].value=requisites.suggestions[0].data.management.post;
                        break;
                    case "address":
                        this.requisitesArr[index].value=requisites.suggestions[0].data.address.value;
                        break;
                    case "pay":
                     //   this.requisitesArr[index].value=requisites.suggestions[0].data.address.value;
                        break;
                }

                if (this.requisitesArr[index].code=="name") {
                    this.requisitesArr[index].value=requisites.suggestions[0].value;
                }
                if (this.requisitesArr[index].code=="name") {
                    this.requisitesArr[index].value=requisites.suggestions[0].value;
                }
            }
        },
        setData() {
            this.setRequisitesData(this.requisitesArr);
            this.sendData();
        }
    },
    mounted () {
        this.requisites.forEach(element => {
            var item=element;
            if (!item.value) item.value="";
            this.requisitesArr.push(item);
        });
    }
}
</script>

<style>

</style>