<template>
<section class="apod-details">
  <div class="animated fadeInDown">
    <br>
    <div class="container-fluid">
      <fieldset>
        <div class="card-body1">
            <div class="lclass">
              <h5 style="float:left">Astronomy Picture of the Day</h5>
              <h4 style="float:right"><date-picker v-model="selectedDate" lang="en" type="date" format="DD-MM-YYYY"  name="Date" :not-after="validDateRangeFrom" v-validate="{required:true}" v-bind:class="{'error': errors.has('Date') }" @change="getDetails"></date-picker></h4>
            </div><br><br>
            <fieldset style="border:1px solid black;background-color: #ffffff;padding-top: 10px;padding-right: 40px;  padding-left: 40px; padding-bottom:30px"><br>
            <vue-element-loading spinner="line-scale" color="#FF6700" :active.sync="isLoading" />
              <center><B><h2>{{title}}</h2></B></center><br>
              <center><iframe ref='myframe' :src="require('@/assets/'+ image)" frameborder="0" width=50% height=400px id="myframe"></iframe></center><br>
              <p>{{explanation}}</p>
            </fieldset>
        </div>
      </fieldset>
    </div>
  </div>
</section>
</template>

<script>
import axios from 'axios'
import DatePicker from 'vue2-datepicker'
import moment from 'moment'
import path from 'path'
import VueElementLoading from 'vue-element-loading';

export default {
  name: 'apod-details',
  components:
  {
    VueElementLoading,
    DatePicker
  },
  data() {
    return {
      selectedDate:'2021-09-01',
      subject: '',
      smid: 0,
      userid: 0,
      isActive: true,
      count: 0,
      final: '',
      image: '',
      title:'',
      explanation:'',
      validDateRangeFrom:new Date(),
      counter: 0,
      isLoading:false,
      mediaType:'',
      docurl:''
    }
  },
  mounted() {
    this.getDetails();
  },
  computed:{
  },
  methods: {
  getDetails(){
  if(!this.selectedDate){
    return false;
  }
  this.isLoading=true;
  this.input = {
    selectedDate:moment(this.selectedDate).format('YYYY-MM-DD')
  }
  axios({
      method: 'POST',
      url: 'http://localhost:8001/api/getAPODDetails',
      data: this.input
    })
    .then(result => {
      this.isLoading=false;
      if (result.data.ResultCode == 100) {
      let url=result.data.ResponseData[0].imageurl
      this.title=result.data.ResponseData[0].title
      this.explanation=result.data.ResponseData[0].description
        this.image=path.basename(url);
        this.$alertify.success(result.data.ReturnMessage)
      } else {
        this.$alertify.error(result.data.ReturnMessage)
      }
    }, error => {
      this.isLoading=false;
      console.error(error)
    })
  }
  }
}
</script>
<style>

.lclass {
  padding: 0.2em 0.5em;
  border: 1px solid #b0b2b3;
  border-bottom: 0px solid #b0b2b3;
  height: 35px;
  color: black;
  font-size: 16px;
  background-color: #ffffff;

}

</style>
