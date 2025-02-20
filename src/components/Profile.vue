<template>
  <div class="profile">
    <div class="header">
      Profile
      <button class="editBtn btn" @click="editProfile()">
        {{ editBtnMsg }}
      </button>
    </div>
    <div class="wrap-container">
      <div class="personal-info contain">
        <div class="subheader">Personal Information</div>
        <div class="container-content">
          <div id="email" class="container-section">
            <div class="prompt">Your Email</div>
            <div class="answer">{{ user.email }}</div>
          </div>

          <div v-if="!user.isVolunteer">
            <div id="highschool" class="container-section">
              <div class="prompt">Your High School's Name</div>
              <div v-show="!activeEdit" class="answer">
                {{ user.highschool }}
              </div>
              <div v-show="!user.highschool && !activeEdit" class="answer">
                (None given)
              </div>
              <input
                v-show="activeEdit"
                v-model="user.highschool"
                type="text"
                class="form-control"
              />
            </div>
          </div>
          <div v-if="user.isVolunteer">
            <div id="phone" class="container-section">
              <div class="prompt">Your Phone Number</div>
              <div v-show="!activeEdit" class="answer">{{ user.phone }}</div>
              <div v-show="!user.phone && !activeEdit" class="answer">
                (None given)
              </div>
              <input
                v-show="activeEdit"
                v-model="user.phone"
                type="text"
                class="form-control"
              />

              <div class="description">
                We will use this number to send you notifications when a student
                needs help. You will only receive notifications during the
                periods that you select in your schedule.
              </div>
            </div>

            <div id="college" class="container-section">
              <div class="prompt">Your College</div>
              <div v-show="!activeEdit" class="answer">{{ user.college }}</div>
              <div v-show="!user.college && !activeEdit" class="answer">
                (None given)
              </div>
              <input
                v-show="activeEdit"
                v-model="user.college"
                type="text"
                class="form-control"
              />
            </div>

            <div id="favoriteAcademicSubject" class="container-section">
              <div class="prompt">Your Favorite Academic Subject</div>
              <div v-show="!activeEdit" class="answer">
                {{ user.favoriteAcademicSubject }}
              </div>
              <div
                v-show="!user.favoriteAcademicSubject && !activeEdit"
                class="answer"
              >
                (None given)
              </div>
              <input
                v-show="activeEdit"
                v-model="user.favoriteAcademicSubject"
                type="text"
                class="form-control"
              />
            </div>
          </div>

          <div class="container-section resetBtn btn">
            <router-link to="resetpassword" class="prompt"
              >Reset password</router-link
            >
          </div>
        </div>
      </div>

      <div v-if="user.isVolunteer" class="cert-info contain">
        <div class="subheader">Certifications and Tutoring Topics</div>
        <div class="container-content cert">
          <div
            v-for="(value, key) in certifications"
            :key="`certification-${key}-${value}`"
          >
            <div v-if="value" class="certBox">
              <div :class="certKey[key]" class="certKey">
                {{ certKey[key] }}
              </div>
              <div class="certValue">{{ key }}</div>
            </div>
          </div>
        </div>
      </div>

      <div v-if="false" class="profile-pic contain">
        <div class="subheader">Profile Picture</div>
        <div class="container-content">
          <div id="profilePic" class="container-section">
            <div :style="avatarStyle" class="answer avatar" />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import UserService from 'src/services/UserService'

export default {
  data () {
    const user = UserService.getUser()
    const avatarUrl =
      user.picture ||
      (user.isVolunteer
        ? 'static/defaultavatar4.png'
        : 'static/defaultavatar3.png')

    const certifications = {}
    if (user.algebra) {
      if (user.algebra.passed) {
        certifications.Algebra = true
      }
    }
    if (user.geometry) {
      if (user.geometry.passed) {
        certifications.Geometry = true
      }
    }
    if (user.trigonometry) {
      if (user.trigonometry.passed) {
        certifications.Trigonometry = true
      }
    }
    if (user.precalculus) {
      if (user.precalculus.passed) {
        certifications.Precalculus = true
      }
    }
    if (user.calculus) {
      if (user.calculus.passed) {
        certifications.Calculus = true
      }
    }
    if (user.esl) {
      if (user.esl.passed) {
        certifications.ESL = true
      }
    }
    if (user.planning) {
      if (user.planning.passed) {
        certifications.Planning = true
      }
    }
    if (user.essays) {
      if (user.essays.passed) {
        certifications.Essays = true
      }
    }
    if (user.applications) {
      if (user.applications.passed) {
        certifications.Applications = true
      }
    }

    const certKey = {}
    certKey.Algebra = 'MATH'
    certKey.Geometry = 'MATH'
    certKey.Trigonometry = 'MATH'
    certKey.Precalculus = 'MATH'
    certKey.Calculus = 'MATH'
    certKey.ESL = 'ESL'
    certKey.Planning = 'COLLEGE'
    certKey.Essays = 'COLLEGE'
    certKey.Applications = 'COLLEGE'

    return {
      user,
      activeEdit: false,
      editBtnMsg: 'Edit Profile',
      name: user.firstname || (user.isVolunteer ? 'volunteer' : 'student'),
      avatarStyle: {
        backgroundImage: `url(${avatarUrl})`
      },
      certifications,
      certKey
    }
  },
  methods: {
    editProfile () {
      if (this.activeEdit) {
        UserService.setProfile(this, this.user)
        this.editBtnMsg = 'Edit Profile'
        this.activeEdit = false
      } else {
        this.editBtnMsg = 'Save Profile'
        this.activeEdit = true
      }
    }
  }
}
</script>

<style scoped>
.avatar {
  display: block;
  width: 50px;
  height: 50px;
  background-size: cover;
}

button {
  height: 30px;
  border-radius: 20px;
  padding: 0px 10px;
  color: #16d2aa;
  background-color: #f6f6f6;
}

button:active,
button:hover {
  background-color: #16d2aa;
  color: #fff;
}

.editBtn {
  font-size: 20px;
  font-weight: 600;
  color: #343440;
  background-color: #fff;
}

.editBtn:active,
.editBtn:hover {
  background-color: #fff;
  color: #16d2aa;
  box-shadow: none;
  margin: 0px;
}

.profile {
  font-size: 16px;
  font-family: Work Sans;
}

.header {
  display: flex;
  padding: 30px;
  margin: 0;
  font-size: 24px;
  border-bottom: 0.5px solid #cccccf;
  align-items: center;
  justify-content: space-between;
  font-weight: 600;
  color: #343440;
}

.difficultCollegeProcessAnswer {
  width: 400px;
  display: flex;
  align-items: left;
  margin-left: 150px;
  flex-direction: column;
}

.basic-info {
  display: flex;
  flex-direction: column;
  align-items: left;
  margin-top: 30px;
}

.info-header {
  display: flex;
  align-items: center;

  margin-left: 30px;
  font-size: 20px;
  font-weight: 600;
}

.info-header.basic {
  height: 60px;
}

.info-header.cert {
  margin-bottom: 15px;
}

ul {
  padding: 15px;
  height: 100%;
  margin: auto;
}

.wrap-container {
  display: flex;
  flex-wrap: wrap;
}

.contain {
  margin: 30px 0 0 30px;
  width: 475px;
}

.container-content {
  background-color: #f0f8fd;
  padding: 30px;
  text-align: left;
}

.subheader {
  font-weight: 600;
  display: flex;
  justify-content: center;
  align-items: center;
  height: 80px;
  background-color: #e3f2fd;
  font-size: 20px;
}

.container-section {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  margin-bottom: 20px;
}

ul {
  padding: 0px;
}

.answer {
  font-weight: 600;
}

.answer ul {
  margin-left: 20px;
}

.description {
  margin-top: 15px;
  font-size: 12px;
}

.form-control {
  border: none;
  box-shadow: none;
  border-radius: 0;
  background-color: #f0f8fd;
}

.form-control {
  border-bottom: 3px solid #16d2aa;
  margin-bottom: 10px;
}

.form-control:focus {
  border-bottom: 3px solid #16d2aa;
  box-shadow: none;
}

.checkbox label {
  font-size: 16px;
}

.cert-info {
  margin-bottom: 30px;
}

.resetBtn {
  background-color: #16d2aa;
  border-radius: 30px;
  width: 200px;
  align-items: center;
  height: 50px;
  justify-content: center;
  font-size: 16px;
  font-weight: 600;
}

.resetBtn a {
  color: #2c3e50;
}

.resetBtn a:hover {
  color: white;
  text-decoration: none;
}

.container-content.cert {
  padding: 0px;
}

.certBox {
  display: flex;
  height: 60px;
  align-items: center;
  padding-left: 20px;
  border-bottom: 1px solid #cccccf;
  font-weight: 600;
}

.certKey {
  border-radius: 12px;
  padding: 0 10px;
  margin: 0 10px 0 0;
  color: #ffffff;
  font-size: 12px;
}

.ESL {
  background-color: #1855d1;
}

.COLLEGE {
  background-color: #fed766;
}

.MATH {
  background-color: #f7aef8;
}



@media screen and (max-width: 488px) {
  .header {
    padding: 1em 20px 1em 3em !important;
  }

  .contain {
    margin: 1.5em !important;
  }
}
</style>
