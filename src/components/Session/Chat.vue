<template>
  <div class="chat">
    <div class="header">Chat</div>

    <div class="message-box">
      <transition name="chat-warning--slide">
        <div class="chat-warning" v-show="chatWarningIsShown">
          Messages cannot contain personal information or profanity
          <span class="chat-warning__close" @click="hideModerationWarning"
            >×</span
          >
        </div>
      </transition>

      <div class="messages">
        <template v-for="(message, index) in messages">
          <div
            :key="`message-${index}`"
            :class="message.email === user.email ? 'left' : 'right'"
            class="message"
          >
            <div class="avatar" :style="message.avatarStyle" />
            <div class="contents">
              <div class="name">
                {{ message.name }}
              </div>
              <span>{{ message.contents }}</span>
              <div class="time">
                {{ message.time }}
              </div>
            </div>
          </div>
        </template>
      </div>
    </div>

    <textarea
      @keydown.enter.prevent
      @keyup.enter="sendMessage"
      v-model="newMessage"
      placeholder="Type here..."
    />
  </div>
</template>

<script>
import moment from 'moment'
import _ from 'lodash'

import UserService from 'src/services/UserService'
import SessionService from 'src/services/SessionService'
import ModerationService from 'src/services/ModerationService'

const STUDENT_AVATAR_URL = 'static/defaultavatar3.png'
const VOLUNTEER_AVATAR_URL = 'static/defaultavatar4.png'

/**
 * @todo {1} Use more descriptive names that comply with the coding standards.
 *           Keep in mind that it also requires a small backend update in
 *           router/sockets.js
 */
export default {
  data () {
    return {
      user: UserService.getUser(),
      messages: [],
      currentSession: SessionService.currentSession,
      newMessage: '',
      chatWarningIsShown: false
    }
  },

  methods: {
    showModerationWarning () {
      this.chatWarningIsShown = true
    },
    hideModerationWarning () {
      this.chatWarningIsShown = false
    },
    showNewMessage (message) {
      this.$socket.emit('message', {
        sessionId: this.currentSession.sessionId,
        user: UserService.getUser(),
        message
      })
    },
    clearMessageInput () {
      this.newMessage = ''
    },
    sendMessage () {
      const message = this.newMessage.trim()
      this.clearMessageInput()
      
      // Early exit if message is blank
      if (_.isEmpty(message)) { return }

      // Reset the chat warning
      this.hideModerationWarning()

      ModerationService
          .checkIfMessageIsClean(this, message)
          .then(isClean => {
            if (isClean) {
              this.showNewMessage(message)
            } else {
              this.showModerationWarning()
            }
          })
    }
  },

  sockets: {
    'session-change' (data) {
      // {1}
      SessionService.currentSession.sessionId = data._id
      SessionService.currentSession.data = data

      // re-render the session's persisted whiteboard canvas
      const img = new Image()
      img.src = data.whiteboardUrl
      img.onload = () => window.App.ctx.drawImage(img, 0, 0)

      // index session's participants by user id
      const studentId = (data.student || {})._id
      const volunteerId = (data.volunteer || {})._id

      const participants = {}
      participants[studentId] = data.student
      participants[volunteerId] = data.volunteer

      // re-load the session's persisted messages
      const messages = data.messages.map(message => {
        let { picture } = message
        const user = participants[message.user] || {}

        if (!picture || picture === '') {
          picture = user.isVolunteer ? VOLUNTEER_AVATAR_URL : STUDENT_AVATAR_URL
        }

        return {
          contents: message.contents,
          name: user.firstname,
          email: user.email,
          isVolunteer: user.isVolunteer,
          avatarStyle: {
            backgroundImage: `url(${picture})`
          },
          time: moment(message.time).format('h:mm a')
        }
      })

      this.messages = messages
    },

    messageSend (data) {
      // {1}
      let { picture } = data
      if (!picture || picture === '') {
        if (data.isVolunteer === true) {
          picture = VOLUNTEER_AVATAR_URL
        } else {
          picture = STUDENT_AVATAR_URL
        }
      }
      this.messages.push({
        contents: data.contents,
        name: data.name,
        email: data.email,
        isVolunteer: data.isVolunteer,
        avatarStyle: {
          backgroundImage: `url(${picture})`
        },
        time: moment(data.time).format('h:mm a')
      })
    }
  },

  updated () {
    let msgBox = document.querySelector('.messages')
    msgBox.scrollTop = msgBox.scrollHeight
  }
}
</script>

<style scoped>
.chat {
  height: 100%;
  position: relative;
}

.header {
  height: 40px;
  background-color: #1855d1;
  color: #fff;
  font-size: 12px;
  font-weight: 600;
  text-align: left;
  padding: 13px;
  position: absolute;
  width: 100%;
}

.message-box {
  height: calc(100% - 40px);
  padding-bottom: 100px;
  overflow: hidden;
  top: 40px;
  position: relative;
}

.chat-warning {
  width: 100%;
  background: var(--c-shadow-warn);
  color: #fff;
  font-weight: normal;
  min-height: 40px;
  position: absolute;
  left: 0;
  top: 0;
  padding: 12px 52px 12px 12px;
  transition: all 0.15s ease-in;
  z-index: 1;
}
.chat-warning__close {
  font-size: 3.5rem;
  width: 40px;
  padding: 10px;
  margin-right: 5px;
  cursor: pointer;
  display: block;
  position: absolute;
  right: 0;
  top: 50%;
  transform: translateY(-50%);
}
.chat-warning--slide-enter,
.chat-warning--slide-leave-to {
  top: -64px;
}

.messages {
  height: 100%;
  overflow: auto;
  display: flex;
  flex-direction: column;
}

.message {
  position: relative;
  padding: 10px;
  display: flex;
  min-height: 61px;
  margin-bottom: 12px;
  justify-content: flex-start;
  background: #fff;
  width: 100%;
}

.avatar {
  width: 30px;
  height: 30px;
  background-size: cover;
  margin-top: 5px;
}

.name {
  font-weight: 600;
}

.time {
  font-size: 12px;
  font-weight: 300;
  color: #73737a;
}

.contents {
  text-align: left;
  width: 200px;
  overflow-wrap: break-word;
  font-size: 16px;
}

textarea {
  width: 100%;
  height: 100px;
  border: none;
  position: absolute;
  left: 0;
  bottom: 0;
  border-top: 1px solid #979797;
  padding: 10px 12px;
}

.left {
  float: left;
}

.right {
  float: right;
  display: flex;
  flex-direction: row-reverse;
}

.right .contents {
  text-align: right;
  padding-right: 10px;
}

.left .contents {
  text-align: left;
  padding-left: 10px;
}

.message-content {
  width: 200px;
}
</style>
