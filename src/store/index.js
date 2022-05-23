import Vue from 'vue'
import Vuex from 'vuex'
import axios from "axios"
import petrovich from "petrovich"
import numberToWordsRu from "number-to-words-ru"
import "babel-polyfill"
Vue.use(Vuex);

export const store = new Vuex.Store({
    actions: {
        sendData(context, callback=false) {
            if (context.state.loadingStatus == 0) {
                var data = {
                    data: {
                        calc_type: 1,
                        callback: callback,
                        types: context.getters.GET_CHECKED_TYPE,
                        types_sum: context.getters.GET_CHECKED_TYPE,
                        services: context.getters.GET_CHECKED_SERVICES,
                        realization: context.getters.GET_REALIZATION.name,
                        realization_price_code: context.getters.GET_REALIZATION.code,
                        organization: context.state.organization[context.state.selectedOrganization].name,
                        requisites: context.getters.GET_REQUISITES,
                        contacts: context.getters.GET_CONTACTS,
                        address: context.getters.GET_ADDRESS(),
                        selectedRealization: context.state.selectedRealization,
                        transportPlace: {
                            name: context.state.transportPlace[context.state.selectedPlace].name,
                            price: context.state.transportPlace[context.state.selectedPlace].price[context.state.selectedRealization],
                        },
                        prices: context.getters.GET_PRICE_FORMATED(),
                        requisites_formated: context.getters.GET_REQUISITES_FORMATTED,
                        contacts_formated: context.getters.GET_CONTACTS_FORMATTED(),
                        sessid: context.state.sessid,
                        params: context.state.bx_params,
                    },
                }
                if (context.state.organizationData && context.state.organizationData.suggestions.length > 0) {
                    data.data.organizationData = context.state.organizationData.suggestions[0];
                }
                var headers = { headers: { 'Content-Type': "application/x-www-form-urlencoded" } }
                context.commit('setLoadingStatus', 1);
                axios.post("/bitrix/services/main/ajax.php?c=fmf:calc.cost&action=GetLinks&mode=ajax", data, headers).then(resp => {
                   // console.log(resp.data);
                    context.commit('setLinkData', resp.data.data);
                    context.commit('setLoadingStatus', 2);
                    //context.commit('setLoadingStatus', 0);
                    context.commit('setState', 5);
                }).then(err => {
                    console.log(err)
                })
            }
        },
        saveFormData(context) {
            if (context.state.bx_send === true) {
                var headers = { headers: { 'Content-Type': "application/x-www-form-urlencoded" } }
                var data = {
                    calc_type: 1,
                    contacts: context.getters.GET_CONTACTS_FORMATTED(),
                    prices: context.getters.GET_PRICE_FORMATED(),
                    address: context.getters.GET_ADDRESS(),
                    services: context.getters.GET_CHECKED_SERVICES,
                    realization_price_code: context.getters.GET_REALIZATION.code,
                    sessid: context.state.sessid,
                    params: context.state.bx_params,
                    SITE_ID: "s1",
                    types: context.getters.GET_CHECKED_TYPE,
                }
                axios.post("/bitrix/services/main/ajax.php?c=fmf:calc.cost&action=SaveData&mode=ajax", context.getters.GET_URLENCODE(data),headers).then(resp=> {
                   // console.log(resp.data)
                })
            }
        },
        async getOrgData(context, query) {
            var token = "7fc162f882819d54069a7aa6725fbb5a30c1c680";
            var url = "https://suggestions.dadata.ru/suggestions/api/4_1/rs/suggest/party";
            var headers = {
                headers: {
                    "Content-Type": "application/json",
                    "Accept": "application/json",
                    "Authorization": "Token " + token,
                }
            }
            var body = {
                query: query
            }
            try {
                context.commit('setLoadingStatus', 3);
                var { data } = await axios.post(url, body, headers);
                context.commit('setLoadingStatus', 0);
                context.commit('setOrganizationData', data);
            }
            catch (e) {
                var data = false;
            }
            return data;
        }
    },
    state: {
        maxState: 5,
        organizationData: null,
        formState: 0,
        loadingStatus: 0,
        selectedRealization: 0,
        selectedPlace: 0,
        selectedOrganization: 0,
        linkData: null,
        agree: null,
        sessid: false,
        bx_params: false,
        bx_send: false,
        util_sum_weight_limit: [
            {weight: 1500, maxSum: 11000},
            {weight: 3500, maxSum: 23000},
            {weight: 5500, maxSum: 30000},
        ],
        price: [
            15, 5, 15
        ],
        types: [
            {
                name: "Монитор LCD",
                weight: 3,
                code: "monitor-lcd",
            },
            {
                name: "Телевизор,  LCD",
                weight: 20,
                code: "tv-lcd",
            },
            {
                name: "Телевизор, монитор ЭЛТ",
                weight: 30,
                code: "monitor-elt",
            },
            {
                name: "Принтер",
                weight: 4,
                code: "printer",
            },
            {
                name: "Сканер",
                weight: 5,
                code: "scanner",
            },
            {
                name: "МФУ",
                weight: 55,
                code: "mfu",
            },
            {
                name: "Плоттер",
                weight: 55,
                code: "plotter",
            },
            {
                name: "Компьютер",
                weight: 6,
                code: "computer",
            },
            {
                name: "Ноутбук",
                weight: 2,
                code: "notebook",
            },
            {
                name: "Телефон",
                weight: 1,
                code: "phone",
            },
            {
                name: "Факст",
                weight: 1,
                code: "fax",
            },
            {
                name: "Док-станция",
                weight: 1,
                code: "doc-station",
            },
            {
                name: "Серверное оборудование",
                weight: 50,
                code: "server",
            },
            {
                name: "Микроволновая печь",
                weight: 1.2,
                code: "microvolovaya-pech",
            },
            {
                name: "Кофемашина",
                weight: 10,
                code: "coffemashina",
            },
            {
                name: "Чайник",
                weight: 1.2,
                code: "chaynik",
            },
            {
                name: "Куллер",
                weight: 10,
                code: "kuller",
            },
            {
                name: "Холодильник",
                weight: 55,
                code: "holodilnik",
            },
            {
                name: "Газовая плита",
                weight: 55,
                code: "gazovaya-plita",
            },
            {
                name: "Мини-холодильник",
                weight: 15,
                code: "mini-holodilnik",
            },
            {
                name: "Бойлер",
                weight: 55,
                code: "boyler",
            },
            {
                name: "Кондиционер",
                weight: 20,
                code: "kondicioner",
            },
            {
                name: "Стиральная машина",
                weight: 55,
                code: "stiralnaya-mashia",
            },
            {
                name: "Посудомоечная машина",
                weight: 40,
                code: "posudomoechnaya-mashina",
            },
            {
                name: "Духовой шкаф",
                weight: 40,
                code: "duhovoy-shkaf",
            },
            {
                name: "Картридж",
                weight: 1,
                price_sell: -100,
                price_util: 100,
                code: "kartridj",
            },
            {
                name: "Иное",
                weight: 0.2,
                field: true,
                code: "custom",
            },
        ],
        services:
        {
            metals: {
                name: "Учет драгоценных металлов",
                checked: false,
                tip: "Учет драгоценных металлов, содержащихся в оборудовании- это отражение в бухгалтерском учете содержания драгоценных металлов в оборудовании покупаемом, стоящем на балансе, продаваемом или списываемом на предприятии.",
                tip_show: false
            },
            pasport: {
                name: "Наличие паспортов отходов",
                checked: false,
                tip: "Паспорт Отхода разрабатывается предприятием, у которого образуется данный вид Отхода. Под Паспортом Отходов для целей заключения Договора понимается Паспорт Отходов на те виды списанного, утратившего потребительские свойства Оборудования, которое планируется передавать на утилизацию нашей организации.",
                tip_show: false
            },
            payNds: {
                name: "Плательщик НДС",
                checked: false,
            },
            pickup: {
                name: "Самовывоз",
                checked: false,
            },
            expertise: {
                name: "Проведение технической экспертизы",
                checked: false,
                count: 0,
                price: 70,
                tip: "Техническая экспертиза это - проведение технического аудита, диагностирования и экспертизы машин, оборудования и технических систем с целью выявления неремонтопригодного, устаревшего оборудования, а также выдача Акта Технической экспертизы для списания неремонтопригодного Оборудования с баланса организации.",
                tip_show: false
            }
        },
        realization: [
            {
                name: "Утилизация", value: 0, price: 15, code:"price_util"
            },
            {
                name: "Утилизация с компенсацией", value: 2, price: 15, code:"price_util"
            },
            {
                name: "Продажа", value: 1, price: 5, code:"price_sell"
            }
        ],
        organization: [
           // { name: "Физическое лицо", realization: [0, 1], metals: { 1: false }, type: 0, min_kbt:true, largeAddres:true },
            { name: "Индивидуальный Предприниматель", realization: [0, 1], metals: { 1: false }, type: 0, largeAddres:false },
            { name: "Юридическое лицо (закупки без применения положений 223-ФЗ и 44-ФЗ)", realization: [0, 1, 2], metals: { 2: true }, type: 1, largeAddres:false },
            { name: "Юридическое лицо, осуществляющее закупки по 223-ФЗ", realization: [0, 1, 2], metals: { 2: true }, type: 1, largeAddres:false },
            { name: "Юридическое лицо, осуществляющее закупки по 44-ФЗ (включая гос. компании)", realization: [2], type: 2, largeAddres:false },
            //{ name: "Орган государственной или муниципальной власти", realization: [2], type: 2, largeAddres:false },
        ],
        requisites: [
            { name: "ИНН", code: "inn", error: false },
            { name: "Наименование организации", code: "name", error: false },
            { name: "Уполномоченное лицо на подписание", code: "managment", error: false },
            { name: "Основание полномочий", code: "authority", error: false },
            { name: "Платежные реквизиты", code: "pay", error: false },
            { name: "Адрес юридический/почтовый", code: "address", error: false },
        ],
        contacts: [
            { name: "ФИО", error: false, class: "name" },
            { name: "Телефон", placeholder: "+7 987 000 12 77", error: false, class: "phone" },
            { name: "Email", placeholder: "inbox@email.ru", error: false, class: "email" }
        ],
        address: {
            name: "Адрес вывоза", error: false, error_text: "Укажите адрес полностью", class: "address",
            house: {
                name: "Дом", class: "house", value:"", error: false, error_text: "",
            },
            entrance: {
                name: "Подъезд", class: "entrance", value:"", error: false, error_text: "",
            },
            comment: {
                name: "Комментарий", class: "comment", value:"", error: false, error_text: "",
            }
        },
        transportPlace: [
            { name: "Внутри ТТК", price: [2000, 1000, 2000] },
            { name: "Между ТТК и МКАД", price: [1500, 1000, 1500] },
            { name: "г. Москва за МКАД", price: [2500, 1000, 2500] },
            { name: "МО — требуется уточнение маршрута (адрес)", price: [0, 0, 0] },
        ]
    },

    getters: {

        GET_UTIL_WEIGHT_SUM_LIMIT: (state, getters) => {
            var weight = getters.GET_TYPE_WEIGHT;
            for (var i = 0; i < state.util_sum_weight_limit.length; i++) {
                if (weight < state.util_sum_weight_limit[i].weight) {
                   
                   return state.util_sum_weight_limit[i].maxSum;
                }
            }
            return false;
        },

        GET_COST_UTILIZATION: (state, getters) => (all=false) =>  {
            var sum = 0;
            var price = [];
            var sum_all = 0;
            state.types.forEach(type => {
                if (type.checked && type.count > 0) {
                    if ((state.selectedRealization == 0 || state.selectedRealization == 2) && type.price_util != undefined)  {
                        sum += type.price_util * type.count;
                    }
                    else if (state.selectedRealization == 1 && type.price_sell != undefined) {
                        sum += type.price_sell * type.count;
                    }
                    else {
                        sum += type.count * type.weight * state.price[state.selectedRealization]
                    }
                }
            })
            sum_all=sum;
            if (state.selectedRealization == 0) {
                var maxSum = getters.GET_UTIL_WEIGHT_SUM_LIMIT;
                if (maxSum) {
                    sum=Math.min(maxSum,sum);
                }
                else return false;
            }
            if (all) {
                sum={sum:sum, sum_all: sum_all};
            }
            return sum;
        },
        GET_COST_EXPERTISE: (state) => {
            if (state.services.expertise.checked && state.services.expertise.count > 0) {
                return state.services.expertise.count * state.services.expertise.price;
            }
            return 0
        },
        GET_TYPE_WEIGHT: (state) => {
            var weight = 0;
            state.types.forEach(type => {
                if (type.checked && type.count > 0) {
                    if (type.weight != undefined) {
                        weight += parseFloat(type.weight)*type.count;
                    }
                }
            })
            return weight;
        },
        GET_COST_LOGISTIC: (state, getters) => {
            if (state.selectedPlace == 3 || state.services.pickup.checked) return 0;
            var weight = getters.GET_TYPE_WEIGHT;
            var price = state.transportPlace[state.selectedPlace].price[state.selectedRealization];
            if ((state.selectedRealization == 0 || state.selectedRealization == 2) && weight >= 200 && weight <= 300)
                price = price / 2;
            else if (state.selectedRealization == 0 && weight >= state.util_sum_weight_limit[0].weight)
                price = 0;
            else if (state.selectedRealization == 1 && weight > 200)
                price = 0;
            return price;
        },
        GET_CHECKED_TYPE: (state) => {
            var types = [];
            state.types.forEach(item => {
                if (item.checked && item.count > 0) {
                    types.push(item);
                }
            });
            return types;
        },
        GET_CHECKED_SERVICES: (state) => {
            var out = {};
            for (var key in state.services) {
                if (state.services[key].checked) {
                    out[key] = state.services[key]
                }
            }
            return out;
        },
        GET_REQUISITES: (state) => {
            var out = [];
            state.requisites.forEach(item => {
                var r = {};
                r.name = item.name;
                r.value = item.value;
                out.push(r);
            })
            return out;
        },
        GET_CONTACTS: (state) => {
            var out = [];
            state.contacts.forEach(item => {
                var r = {};
                r.name = item.name;
                r.value = item.value;
                r.code = item.class;
                out.push(r);
            })
            return out;
        },
        GET_ADDRESS: (state, getters) => () => {
            var out = {};
            if (state.address.value===undefined)
                out.value=false;
            else
                out.value = state.address.value;
            out.name = "Адрес";
            out.pickup = state.services.pickup.checked;
            if (getters.GET_ORGANIZATION.largeAddres) {
                out.fiz=true;
                out.house=state.address.house;
                out.entrance=state.address.entrance;
                out.comment=state.address.comment;
            }
            return out;
        },

        GET_NDS_SUM: (state) => (price) => {
            return price * 0.20 + price;
        },

        GET_MONEY_FORMAT: () => (n) => {
            return parseFloat(n).toFixed(2).replace(/(\d)(?=(\d{3})+\.)/g, "$1 ").replace(".", ",");
        },

        GET_PRICE_OBJ: (state, getters) => (price, count = 1) => {
            var sum = "";
            if (price.sum_all != undefined)
                sum = price.sum_all * count;
            else sum = price * count;
            var sumNds = getters.GET_NDS_SUM(sum);
            var sumText = numberToWordsRu.convert(sum);
            var sumNdsText = numberToWordsRu.convert(sumNds);
            var nds = sumNds - sum;
            var price = {
                price: price,
                sum: sum,
                sumNds: sumNds,
                nds: nds,
                ndsFormatted: getters.GET_MONEY_FORMAT(nds),
                textSum: sumText,
                sumNdsText: sumNdsText,
                sumFormatted: getters.GET_MONEY_FORMAT(sum),
                sumNdsFormatted: getters.GET_MONEY_FORMAT(sumNds),
                count: count
            }
            return price;
        },

        GET_PRICE_FORMATED: (state, getters) => () => {
            var prices = {
                expertise: getters.GET_PRICE_OBJ(state.services.expertise.price, state.services.expertise.count),
                types: getters.GET_PRICE_OBJ(getters.GET_COST_UTILIZATION(true)),
                transportPlace: getters.GET_PRICE_OBJ(getters.GET_COST_LOGISTIC),
            }
            return prices;
        },
        GET_REQUISITES_FORMATTED: (state) => {
            var requisites = {}
            state.requisites.forEach(item => {
                if (item.value != undefined)
                    requisites[item.code] = item.value;
            })
            if (requisites.managment) {
                var nameAr = requisites.managment.split(' ');
                var g = petrovich({ last: nameAr[0], first: nameAr[1], middle: nameAr[2] }, "genitive");
                requisites.nameSk = g.last + " " + g.first + " " + g.middle;
                requisites.nameShort = nameAr[0] + " " + nameAr[1][0] + ". " + nameAr[2][0] + ".";
            }
            if (state.organizationData && state.organizationData.suggestions.length > 0) {
                if (state.organizationData.suggestions[0].data.address.unrestricted_value)
                    requisites.fullAddress = state.organizationData.suggestions[0].data.address.unrestricted_value;
            }
            return requisites;
        },
        GET_CALLBACK: (state, getters) => {
            if (state.services.pasport.checked || getters.GET_UTIL_WEIGHT_SUM_LIMIT==false) {
                return true;
            }
            return false;
        },

        GET_REALIZATION: (state) => {
           return state.realization.find(item=>{
                return item.value==state.selectedRealization;
            })
        },

        GET_CONTACTS_FORMATTED: (state, getters) => () => {
            var contacts = getters.GET_CONTACTS;
            var out = {};
            contacts.forEach(item => {
                out[item.code]=item.value;
            })
            return out;
        },
        GET_ORGANIZATION: (state) => () => {
            return state.organization[state.selectedOrganization];
        },
        GET_URLENCODE: (state, getters) => (element,key,list) => {
            var list = list || [];
            if(typeof(element)=='object'){
                for (var idx in element)
                getters.GET_URLENCODE(element[idx],key?key+'['+idx+']':idx,list);
            } else {
                list.push(key+'='+encodeURIComponent(element));
            }
            return list.join('&');
        }
    },

    mutations: {
        setState(state, value) {
            if (value < 0) value = 0
            state.formState = Math.min(state.maxState, value);
            if (value>0) {
                try {
                    document.querySelector('.detail_text').style.display="none";
                } catch (e) {}
            }
            else {
                try {
                    document.querySelector('.detail_text').style.display="block";
                } catch (e) {}
            }
            document.querySelector("html").scrollTop=0;
        },
        setDataType(state, { types, services }) {
            if (types) state.types = types;
            if (services) {
                state.services.expertise = services.expertise;
                state.services.pickup = services.pickup;
            }
        },
        setDataOrganization(state, { selectedOrganization, contacts, services, selectedRealization, agree }) {
            if (contacts) state.contacts = contacts;
            if (agree) state.agree = agree;
            if (services) {
                state.services.metals = services.metals;
                state.services.pasport = services.pasport;
                state.services.payNds = services.payNds;
            }
            state.selectedOrganization = selectedOrganization;
            state.selectedRealization = selectedRealization;
        },
        setDataAddresTo(state, { address, selectedPlace }) {
            if (address) state.address = address;
            state.selectedPlace = selectedPlace;
        },
        setLoadingStatus(state, value) {
            state.loadingStatus = value;
        },
        setLinkData(state, value) {
            state.linkData = value;
        },
        setTypes(state, value) {
            state.types = value;
        },
        setOrganizationData(state, value) {
            state.organizationData = value;
        },
        setRequisitesData(state, value) {
            state.requisites = value;
        },
        setParams(state, data) {
            for(var key in data) {
                state[key]=data[key];
            }
        }
    }
})
