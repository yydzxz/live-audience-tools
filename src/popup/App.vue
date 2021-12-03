<template>
  <el-tabs v-model="activeName" type="card" @tab-click="handleClick">
    <el-tab-pane label="斗鱼" name="first">
      <el-table
      :data="douyuTableData"
      :show-header=false
      style="width: 100%;cursor:pointer"
      @row-click="joinDouyuRoom">
        <el-table-column
          label="头像"
          width="60">
          <template slot-scope="scope">
            <img :src="scope.row.avatar_small" width="48" height="48" style="border-radius: 50%;"/>
            <i class="FollowList-isWheel" v-if="scope.row.videoLoop===1"></i>
          </template>
        </el-table-column>
        <el-table-column
          prop="videoLoop"
          label="直播状态"
          :formatter="douyuLiveStatusFormatter">
        </el-table-column>
        <el-table-column
          prop="nickname"
          label="昵称"
          width="120">
        </el-table-column>
        <el-table-column
          prop="room_name"
          label="房间名"
          width="180">
        </el-table-column>
      </el-table>
    </el-tab-pane>
    <el-tab-pane label="bilibili" name="second">
      <el-table
      :data="bilibiliTableData"
      :show-header=false
      style="width: 100%;cursor:pointer"
      @row-click="joinBilibiliRoom">
      <el-table-column
          label="头像"
          width="60">
          <template slot-scope="scope">
            <img :src="scope.row.face" width="48" height="48" style="border-radius: 50%;"/>
          </template>
      </el-table-column>
      <el-table-column
        prop="live_status"
        label="直播状态"
        :formatter="bilibiliLiveStatusFormatter">
      </el-table-column>
      <el-table-column
          prop="uname"
          label="昵称"
          width="120">
      </el-table-column>
      <el-table-column
        prop="title"
        label="房间名"
        width="180">
      </el-table-column>
    </el-table>
    </el-tab-pane>
    <el-tab-pane label="虎牙" name="third">
      <el-table
      :data="huyaTableData"
      :show-header=false
      style="width: 100%;cursor:pointer"
      @row-click="joinHuyaRoom">
      <el-table-column
          label="头像"
          width="60">
          <template slot-scope="scope">
            <img :src="scope.row.avatar180" width="48" height="48" style="border-radius: 50%;"/>
          </template>
      </el-table-column>
      <el-table-column
        prop="isLive"
        label="直播状态"
        width="120"
        :formatter="huyaLiveStatusFormatter">
      </el-table-column>
      <el-table-column
          prop="nick"
          label="昵称"
          width="140">
        </el-table-column>
      <el-table-column
        prop="intro"
        label="房间名"
        width="180">
      </el-table-column>
    </el-table>
    </el-tab-pane>
    <!-- <el-tab-pane label="企鹅" name="fourth">定时任务补偿</el-tab-pane> -->
  </el-tabs>
</template>

<script>
import axios from 'axios'
export default {
  name: 'App',
  created: function() {
    const myThis = this
    chrome.cookies.get({ url: 'https://www.huya.com', name: 'udb_uid' }, function (cookie) {
      myThis.bilibiliParam.uid = cookie.value
      myThis.getHuyaLiveData()
    })
    this.getDouyunLiveData()
    this.getBilibiliLiveData()
  },
  data() {
    return {
      activeName: 'first',
      douyuTableData: null,
      bilibiliTableData: null,
      bilibiliParam: {
        callback: 'jQuery11130436432368755471_1638006419683',
        uid: ''
      },
      huyaTableData: null
    }
  },
  methods: {
    getDouyunLiveData: function() {
      const myThis = this
      axios.get('https://www.douyu.com/wgapi/livenc/liveweb/visitedList')
        .then(function (response) {
          console.log('斗鱼')
          console.log(response.data)
          myThis.douyuTableData = response.data.data.list
        })
    },
    getBilibiliLiveData: function() {
      const myThis = this
      axios.get('https://api.live.bilibili.com/xlive/web-ucenter/user/following?page=1&page_size=100')
        .then(function (response) {
          console.log('bilibili')
          console.log(response.data)
          myThis.bilibiliTableData = response.data.data.list
        })
    },
    getHuyaLiveData: function() {
      const page = 1
      const pageSize = 100
      const datetime = new Date().getTime()
      const myThis = this
      const url = `https://fw.huya.com/dispatch?do=subscribeList&callback=${this.bilibiliParam.callback}&uid=${this.bilibiliParam.uid}&page=${page}&pageSize=${pageSize}&_=${datetime}`
      console.log(myThis)
      console.log(url)
      axios.get(url)
        .then(function (response) {
          console.log('虎牙')
          // console.log(response.data)
          let data = response.data.substring(myThis.bilibiliParam.callback.length + 1, response.data.length - 1)
          // console.log(data)
          data = JSON.parse(data)
          console.log(data)
          myThis.huyaTableData = data.result.list
        })
    },
    joinDouyuRoom: function(row, column, cell, event) {
      const newURL = 'https://www.douyu.com/' + row.url
      chrome.tabs.create({ url: newURL })
    },
    douyuLiveStatusFormatter: function(row, column, cellValue, index) {
      return row.videoLoop === 1 ? '录播' : '直播中'
    },
    douyuGetAllRoom: function() {
      // const myThis = this
      // const page = 1
      // axios.get('https://www.douyu.com/wgapi/livenc/liveweb/visitedMoreList?cid1=0&page=' + page)
      //   .then(function (response) {
      //     console.log(response.data)
      //     myThis.douyuTableData = response.data.data.list
      //   })
    },
    joinBilibiliRoom: function(row, column, cell, event) {
      const newURL = 'https://live.bilibili.com/' + row.roomid
      chrome.tabs.create({ url: newURL })
    },
    bilibiliLiveStatusFormatter: function(row, column, cellValue, index) {
      return row.live_status === 1 ? '直播中' : '未开播'
    },
    huyaLiveStatusFormatter: function(row, column, cellValue, index) {
      return row.isLive === true ? '直播中' : '未开播'
    },
    joinHuyaRoom: function(row, column, cell, event) {
      const newURL = 'https://www.huya.com/' + row.profileRoom
      chrome.tabs.create({ url: newURL })
    },
    handleClick(tab, event) {
      console.log(tab, event)
    }
  }
}
</script>

<style>
html {
  width: 400px;
  height: 400px;
}
.FollowList-isWheel {
    background: url(https://shark2.douyucdn.cn/front-publish/live-master/assets/images/wheel2_3d29558.gif);
    width: 18px;
    height: 18px;
    display: block;
    position: absolute;
    bottom: 13px;
    right: 0px;
    background-size: 20px;
}
</style>
