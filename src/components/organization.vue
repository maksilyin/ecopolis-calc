<template>
  <div>
    <div class="section title_section">
        <div class="section_title"><h3>Организация</h3></div>
        <div class="form_group" v-for="(org_item, i) in organization" :key="i">
            <input v-model="organizationSelected" type="radio" :value="i" :id="'organization'+i">
            <label class="check" :for="'organization'+i">{{org_item.name}}</label>
      </div>
    </div>
    <div class="section" v-if="metals">
      <div class="form_group">
        <input v-model="metals.checked" type="checkbox" id="metals" />
        <label class="check" for="metals">{{ metals.name }}</label>
        <span class="tip" @mouseenter="metals.tip_show=true" @mouseleave="metals.tip_show=false"></span>
        <transition name="show_tip">
          <span v-if="metals.tip_show" class="tip_text">{{metals.tip}}</span>
        </transition>
      </div>
       <div class="form_group">
        <input v-model="pasport.checked" type="checkbox" id="pasport" />
        <label class="check" for="pasport">{{ pasport.name }}</label>
        <span class="tip" @mouseenter="pasport.tip_show=true" @mouseleave="pasport.tip_show=false"></span>
        <transition name="show_tip">
          <span v-if="pasport.tip_show" class="tip_text">{{pasport.tip}}</span>
        </transition>
      </div>
       <div class="form_group">
        <input v-model="payNds.checked" type="checkbox" id="payNds" />
        <label class="check" for="payNds">{{ payNds.name }}</label>
      </div>
    </div>
    <div class="section noborder">
        <div class="realization form_group">
            <label>Вид реализации имущества</label>
            <select v-model="typeRealization" :class="{error_select: errorRealization}" @change="errorRealization=false">
            <option
                v-for="(realiz, i) in realization"
                :key="i"
                :value="realiz.value"
                :disabled="!checkRealization(realiz.value)"
            >
                {{ realiz.name }}
            </option>
            </select>
        </div>
    </div>
    <div class="section title_section">
        <div class="section_title"><h3>Контактное лицо</h3></div>
        <div class="contacts">
            <div class="form_group placeholder" :class="[contact.class, {error: contact.error}]" v-for="(contact, i) in contactsArr" :key="i">
                <input v-if="contact.class=='phone'" v-mask="'+7 (999) 999 99 99'" v-model="contactsArr[i].value" @change="$forceUpdate()" @focus="contact.error=false" type="text" :id="'contact'+i">
                <input v-else v-model="contactsArr[i].value" @change="$forceUpdate()" @focus="contact.error=false" type="text" :id="'contact'+i">
                <label v-if="contactsArr[i].value==''" :for="'contact'+i">{{setNameField(contact)}}<span v-if="contact.placeholder"> {{contact.placeholder}}</span></label>
            </div>
       </div>
    </div>
    <div class="section noborder">
        <div class="form_group agree" :class="{error: agree.error}"> 
            <input v-model="agree.checked" type="checkbox" id="agree" @change="agree.error=false"/>
            <label class="check" for="agree">Я даю своё согласие на обработку моих персональных данных и подтверждаю, что данные указаны верно. 
                <a href ="/about/agreement/">Подробнее.</a>
            </label>
        </div>
      <button @click="setData()" class="btn_main next">ДАЛЕЕ</button>
    </div>

  </div>
</template>

<script>
import {mapState, mapMutations, mapActions, mapGetters} from "Vuex" //vuex
export default {
    data () {
        return {
            typeRealization: 0,
            errorRealization: false,
            metals: null,
            pasport: null,
            payNds: null,
            agree: {
                checked: false, //test-003
                error: false,
            },
            organizationSelected:0,
            requisitesArr:[],
            contactsArr:[],
            emailValid:/^([A-Za-z0-9_\-\.])+\@([A-Za-z0-9_\-\.])+\.([A-Za-z]{2,4})$/,
            phoneValid:/^\+7\s\(\d{3}\)\s\d{3}\s\d{2}\s\d{2}$/,
        }
    },
    computed: {
        ...mapState(["organization", "requisites", "contacts", "formState", "selectedOrganization", "selectedRealization", "loadingStatus","services", "realization"]),
        ...mapGetters(["GET_CALLBACK"]),
    },
    methods: {
        ...mapMutations(["setState", "setDataOrganization"]),
        ...mapActions(["getOrgData", "sendData", "saveFormData"]),
        setFields() {
            this.requisites.forEach(element => {
                var item=element;
                if (!item.value) item.value="";
                this.requisitesArr.push(item);
            });

            this.contacts.forEach(element => {
                var item=element;
                if (!item.value) item.value="";
                this.contactsArr.push(item);
            });
            this.organizationSelected=this.selectedOrganization;
            this.typeRealization=this.selectedRealization;
            this.metals=this.services.metals;
            this.pasport=this.services.pasport;
            this.payNds=this.services.payNds;
            if (this.$store.state.agree)
                this.agree = this.$store.state.agree;
        },
        setNameField(item) {
            if (item.error && item.error_text!=undefined && item.error_text!="") return item.error_text
            return item.name
        },
        setData() {
            var isError=false;

            for (var i = 0; i < this.contactsArr.length; i++) {
                if (this.contactsArr[i].class=="name" && this.contactsArr[i].value.length==0) {
                    this.contactsArr[i].error=true;
                    isError=true;
                }
                else if (this.contactsArr[i].class=="phone" && !this.phoneValid.test(this.contactsArr[i].value)) {
                    this.contactsArr[i].error=true;
                    isError=true;
                }
                 else if (this.contactsArr[i].class=="email" && !this.emailValid.test(this.contactsArr[i].value)) {
                    this.contactsArr[i].error=true;
                    isError=true;
                }
            }

            if (!this.agree.checked) {
                this.agree.error=true;
                isError=true;
            }

            var services = {
                metals:this.metals,
                pasport:this.pasport,
                payNds:this.payNds
            }

            if (!this.checkRealization(this.typeRealization)) {
                isError=true;
                this.errorRealization=true;
            }

            if (!isError) {
                this.setDataOrganization({selectedOrganization:Number.parseInt(this.organizationSelected), contacts: this.contactsArr, services:services, selectedRealization: Number.parseInt(this.typeRealization), agree: this.agree});
                if (this.GET_CALLBACK) {
                    this.sendData(true)
                }
                else {
                    this.saveFormData();
                    this.setState(1);
                }
            }
        },
        checkRealization(value) {
            var org_selected = this.organization[this.organizationSelected];
            if (org_selected.realization.includes(value)) {
                if (org_selected.metals && org_selected.metals[value] != undefined) {
                    if (this.metals!=null && org_selected.metals[value]==this.metals.checked)  {
                        return true;
                    }
                }
                else return true;
            }
            return false;
        }
    }, 
    mounted() {
        this.setFields();
    }
}
</script>

<style lang="sass">
    #calculator .calc_wrapper .form_group.agree
        width: 100%
        margin-bottom: 60px
</style>>