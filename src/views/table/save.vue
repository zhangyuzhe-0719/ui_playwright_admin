<template>
  <div class="app-container">
    <h2 style="text-align: center;">发布新课程</h2>
    <el-steps :active="2" process-status="wait" align-center style="margin-bottom: 40px;">
      <el-step title="填写课程基本信息"/>
      <el-step title="创建课程大纲"/>
      <el-step title="最终发布"/>
    </el-steps>

    <!-- <el-button type="text" @click="dialogChapterFormVisible=true">添加章节</el-button> -->
    <el-button type="text" @click="openDialogChapter()">添加章节</el-button>

<!--  注意是chapter.children  不是chaperVideoList.children-->
    <!-- <ul>
      <li v-for="chapter in chaperVideoList" :key="chapter.id"> {{chapter.title}}
        <ul>
          <li v-for="video in chapter.children" :key="video.id">{{video.title}}</li>
        </ul>
      </li>
    </ul> -->

    <ul class="chanpterList">
      <li v-for="chapter in chaperVideoList" :key="chapter.id">
          <p>
              {{ chapter.title }}
              <!-- 每个章节条后面的三个操作 -->
              <cpan class="acts">
              <!-- 添加小节的时候 需要传如章节的ID -->
                  <el-button type="text" @click="openVideo(chapter.id)">添加小节</el-button>
                   <!-- <el-button type="text" @click="dialogVideoFormVisible = true; chapterId = chapter.id">添加小节</el-button> -->
                  <!-- 点击编辑也是弹出一个弹框  编辑的时候需要传一个章节ID，进行回显获取信息-->
                  <el-button type="text" @click="removeChapter(chapter.id)">删除</el-button>
                  <el-button type="text" @click="openEditChapter(chapter.id)">编辑</el-button>
              </span>
          </p >

          <!-- 视频 -->
          <ul class="chanpterList videoList">
              <li
                  v-for="video in chapter.children"
                  :key="video.id">
                  <p>{{ video.title }}
                      <span class="acts">
                          <el-button type="text" @click="removeVideo(video.id)">删除</el-button>
                          <el-button type="text" @click="editVideo(video.id)">编辑</el-button>
                          <!-- <el-button type="text" @click="removeVideo(video.id)">删除</el-button> -->
                      </span>
                  </p >
              </li>
          </ul>
      </li>
    </ul>

    <div>
      <el-button @click="previous">上一步</el-button>
      <el-button :disabled="saveBtnDisabled" type="primary" @click="next">下一步</el-button>
    </div>

    <!-- 添加和修改章节表单 -->
    <el-dialog :visible.sync="dialogChapterFormVisible" title="添加章节">
        <el-form :model="chapter" label-width="120px">
            <el-form-item label="章节标题">
                <el-input v-model="chapter.title"/>
            </el-form-item>
            <el-form-item label="章节排序">
                <el-input-number v-model="chapter.sort" :min="0" controls-position="right"/>
            </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
            <el-button @click="dialogChapterFormVisible = false">取 消</el-button>
            <el-button type="primary" @click="saveOrUpdate">确 定</el-button>
        </div>
    </el-dialog>

    <!-- 添加和修改课时表单 -->
    <el-dialog :visible.sync="dialogVideoFormVisible" title="添加课时">
      <el-form :model="video" label-width="120px">
        <el-form-item label="课时标题">
          <el-input v-model="video.title"/>
        </el-form-item>
        <el-form-item label="课时排序">
          <el-input-number v-model="video.sort" :min="0" controls-position="right"/>
        </el-form-item>
        <el-form-item label="是否免费">
          <el-radio-group v-model="video.free">
            <el-radio :label="true">免费</el-radio>
            <el-radio :label="false">默认</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="上传视频">
          <!-- TODO -->
<!-- beforeVodRemove 想重新上传 点击x的时候 ，调用此方法,点击x弹出一个框 ，询问是否确定删除，点击确定调用handleVodRemove
根据视频ID把视频删除掉，要删除掉上传到阿里云上的视频 -->
          <el-upload
            :on-success="handleVodUploadSuccess"
            :on-remove="handleVodRemove"
            :before-remove="beforeVodRemove"
            :on-exceed="handleUploadExceed"
            :file-list="fileList"
            :action="BASE_API + '/eduvod/video/uploadVideo'"
            :limit="1"
            class="upload-demo">

            <el-button size="small" type="primary">点击上传</el-button>
            <!--  class="el-icon-question" 是一个问号 放上去后会显示div中的文字信息-->
            <el-tooltip placement="right-end">
              <div slot="content" >最大支持1G, <br>
              支持AVI，DV,<br>
              等视频格式上传
              </div>
              <i class="el-icon-question"></i>
            </el-tooltip>

          </el-upload>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogVideoFormVisible = false">取 消</el-button>
        <el-button :disabled="saveVideoBtnDisabled" type="primary" @click="saveOrUpdateVideo">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import chapter from '@/api/teacher/chapter.js'
import video from '@/api/teacher/video.js'

export default {

  data() {
    return {
      BASE_API: process.env.BASE_API,
      saveBtnDisabled: false, // 保存按钮是否禁用
      saveVideoBtnDisabled: false, // 添加小节中的保存按钮
      chaperVideoList: [],
      courseId: '', // 课程ID
      dialogChapterFormVisible: false, // 章节弹框值
      dialogVideoFormVisible: false, // 小节弹框
      chapterId: '', // 课时所在的章节id
      // 小节数据
      video: {
        title: '',
        sort: 0,
        free: 0,
        videoSourseId: '',
        videoOriginalName: '',
      },
      // 章节数据
      chapter: {
        title: '',
        sort: 0
      },
      // 上传到小节的视频文件列表
      fileList:[],
    }
  },

  created() {

    console.log('chapter created')
    // 获取路由上的ID值
    if(this.$route.params && this.$route.params.id) {
      this.courseId = this.$route.params.id
      // 根据课程ID获取章节和小节
      this.getChapterVideoList()
    }
  },

  methods: {
    // ===========================小节操作===============================
    beforeVodRemove(file, fileList) {
      return this.$confirm(`确定移除 ${ file.name }？`);
    },
    // 点击叉调用的方法
    handleVodRemove() {
      video.deleteAliyunVod(this.video.videoSourseId)
        .then(res => {
          //   提示信息
          this.$message({
            type: 'success',
            methods: "删除视频成功"
          });

          // 把文件列表清空，要手动清空一下
          this.fileList = []

          // 上传成功之后，除了阿里云的要删除，数据里也要删除掉
          this.video.videoSourseId = ''
          this.video.videoOriginalName =''
          // TODO bug数据库里没写进去

        })
    },
    // 上传小节视频成功之后调用 成功回调
    // file上传的文件
    handleVodUploadSuccess(res, file, fileList) {
      // 上传之后的ID
      this.video.videoSourseId = res.data.videoId
      console.log(this.video.videoSourseId)
      this.video.videoOriginalName = file.name
      console.log(this.video.videoOriginalName)
    },

// 视频上传多于一个的时候
    handleUploadExceed() {
      this.$message.warning('想要重新上传视频，请先删除已经上传的视频')
    },

    // 编辑按钮点击回显
    editVideo(videoId) {
      this.dialogVideoFormVisible = true
      video.getVideoInfo(videoId)
        .then(res => {
          this.video = res.data.videoInfo
        })
    },

    // 传入的是小节ID
    removeVideo(id) {
      this.$confirm('此操作将删除小节，是否继续？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        video.deleteVideo(id)
        // 删除成功
          .then(response => {
            this.$message({
              type: 'success',
              message: '删除小节成功'
            });
            // 回到列表页页面 刷新页面
            this.getChapterVideoList()
          })
      })
    },

    // 小节弹框操作
    openVideo(chapterId) {
      this.dialogVideoFormVisible = true
      // this.video = {}
      // chapterId是传过来的
      // 因为库里，小节数据中需要有章节I
      this.video.chapterId = chapterId
      // console.log(this.video.chapterId)
    },

    saveVideo() {
      // 设置课程ID
      this.video.courseId = this.courseId
      video.addVideo(this.video)
        .then(response => {
          this.dialogVideoFormVisible = false
          this.$message({
            type: 'success',
            message: '添加小节成功'
          });
// 再查一下页面的所有数据
          this.getChapterVideoList()
        })
    },

    helpSaveVide() {
      // 关闭弹框
      this.dialogVideoFormVisible = false
      // 刷新列表
      this.getChapterVideoList()

    },

    updateVideo() {
      video.updateVideoInfo(this.video)
        .then(response => {
          this.$message({
            type: 'success',
            message: '修改成功!'
          })
          this.helpSaveVide()
        })
    },

    saveOrUpdateVideo() {
      this.saveVideoBtnDisabled = true
      if(!this.video.id) {
        this.saveVideo()
      } else {
        this.updateVideo()
      }

    },

    // ===========================章节操作===============================
    removeChapter(chapterId) {
      this.$confirm('此操作将删除章节，是否继续？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        chapter.deleteChapter(chapterId)
        // 删除成功
          .then(response => {
            this.$message({
              type: 'success',
              message: '删除成功'
            });
            // 回到列表页页面
            this.getChapterVideoList()
          })
      })

    },

    // 点编辑弹个框，回显并修改信息 编辑就是一个回显操作，之后的更改就是保存的事了
    openEditChapter(chapterId) {
      this.dialogChapterFormVisible = true
      chapter.getChapter(chapterId)
        .then(response => {
          this.chapter = response.data.chapter
          // console.log(this.chapter)
        })
    },

    openDialogChapter() {
      this.dialogChapterFormVisible=true

      // 第二次添加章节时，页面应该时空
      this.chapter = {}
    },

    getChapterVideoList() {
    chapter.getAllChapterVideo(this.courseId)
      .then(response => {
        this.chaperVideoList = response.data.item
      })
    },

    previous() {
      console.log('previous')
      this.$router.push({ path: '/course/info/' + this.courseId })
    },

    next() {
      console.log('next')
      this.$router.push({ path: '/course/publish/' + this.courseId })
    },

    saveChapter() {
      // 设置课程ID到chapter对象里面 因为数据库中该值是not null的，先设置一下 不报错
      this.chapter.courseId = this.courseId
      chapter.addChapter(this.chapter)
        .then(response => {
          // 关闭探矿 刷新信息 提示
          this.dialogChapterFormVisible = false
          this.$message({
            type: 'success',
            message: '添加成功'
          });
// 再查一下页面的所有数据
          this.getChapterVideoList()
        })
    },

    updateChapter() {
      chapter.updateChapter(this.chapter)
        .then(response => {
          this.dialogChapterFormVisible = false
          this.$message({
            type: 'success',
            message: '编辑成功'
          });
// 再查一下页面的所有数据
          this.getChapterVideoList()
        })
    },

// 添加章节按钮 和编辑按钮都调用这个方法
    saveOrUpdate() {
      if(!this.chapter.id) {
        this.saveChapter()
      } else {
        this.updateChapter()
      }

    },
  }
}
</script>

<style scoped>
.chanpterList{
    position: relative;
    list-style: none;
    margin: 0;
    padding: 0;
}

.chanpterList li{
  position: relative;
}

.chanpterList p{
  float: left;
  font-size: 20px;
  margin: 10px 0;
  padding: 10px;
  height: 70px;
  line-height: 50px;
  width: 100%;
  border: 1px solid #DDD;
}
.chanpterList .acts {
    float: right;
    font-size: 14px;
}

.videoList{
  padding-left: 50px;
}

.videoList p{
  float: left;
  font-size: 14px;
  margin: 10px 0;
  padding: 10px;
  height: 50px;
  line-height: 30px;
  width: 100%;
  border: 1px dotted #DDD;
}
</style>