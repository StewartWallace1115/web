<template>
  <div class="registration-container background">
    <div class="main-page">
      <div class="logo-class">
        <img class="logo-img" src="../assets/p_logo_white.png" />
      </div>
      <div class="form-register">
        <div class="header">
          <router-link to="login" class="login-link">Log In</router-link>
          <div class="registration-header">Sign Up</div>
        </div>
        <div class="body">
          <volunteer-form
            v-if="this.userSelection === 'volunteer'"
          ></volunteer-form>
          <student-form
            v-else-if="this.userSelection === 'student'"
          ></student-form>
          <div class="inner" v-else>
            <b>Are you a student or a volunteer?</b>
            <button
              class="btn btn-lg btn-primary btn-block"
              type="submit"
              @click.prevent="selectStudent()"
            >
              STUDENT
            </button>
            <button
              class="btn btn-lg btn-primary btn-block"
              type="submit"
              @click.prevent="selectVolunteer()"
            >
              VOLUNTEER
            </button>
          </div>
        </div>
      </div>
      <div class="bottom-div"></div>
    </div>
  </div>
</template>

<script>
import StudentForm from './Registration/StudentForm'
import VolunteerForm from './Registration/VolunteerForm'

export default {
  components: {
    StudentForm,
    VolunteerForm
  },
  data () {
    return {
      userSelection: null
    }
  },
  methods: {
    selectVolunteer () {
      this.userSelection = 'volunteer'
    },
    selectStudent () {
      this.userSelection = 'student'
    }
  }
}
</script>

<style scoped>
.registration-container {
  height: 100%;
}

.header {
  display: flex;
  justify-content: space-between;
  margin-bottom: 0px;
  margin-top: 25px;
}

.body {
  margin: auto;
}

.login-link {
  color: #73737a;
  font-weight: 600;
}

.registration-header {
  color: #16d2aa;
  font-weight: 600;
}

/**
 * @todo {1} Consider refactoring (https://github.com/UPchieve/web/pull/84#discussion_r216404804)
 */
.background {
  display: flex;
  background-image: url('../assets/onboarding_background.png');
  background-size: cover;
  height: 100%;
  font-size: 16px;
  margin-left: -300px; /* {1} */
  position: relative;
  z-index: 2; /* {1} */
}

.form-register {
  display: flex;
  flex-direction: column;
  width: 500px;
  height: 500px;
  margin: auto;
  background-color: white;
  padding: 0px 50px;
}

.footer {
  display: flex;
  font-weight: 600;
  font-size: 12px;
  justify-content: space-around;
  width: 500px;
  height: 40px;
  align-items: center;
  align-self: center;
  padding: 0 50px;
  background-color: #f6f6f6;
  border-top: 0.5px solid #cccccf;
  margin-top: 130px;
}

.footer a {
  color: #73737a;
}

button[type='submit'] {
  background-color: #f6f6f6;
  border: none;
  font-weight: 600;
  color: #16d2aa;
  height: 40px;
  border-radius: 20px;
  font-size: 12px;
  margin-top: 50px;
}

button[type='submit']:hover,
button[type='submit']:active {
  color: white;
  background-color: #16d2aa;
}

.main-page {
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
  height: 100%;
  width: 100%;
}

.logo-img {
  width: 155px;
  padding-bottom: 25px;
}

.logo-class {
  flex: 1;
  display: flex;
  align-items: flex-end;
  justify-content: center;
}

.bottom-div {
  flex: 1;
}




@media screen and (max-width: 488px) {
  .background {
    margin-left: 0em !important;
    padding-left: 0em !important;
  }

  .logo-img {
    width: 40% !important;
    min-width: 150px !important;
  }

  .form-register {
    width: 88% !important;
    height: auto !important;
    padding: 0em !important;
  }

  .header {
    margin: 1.5em 1.5em 0.8em !important;
    padding: 0em !important;
  }

  .body {
    margin: 2em 2em 3em !important;
    padding: 0em !important;
    /* text-align: center !important; */
  }

  .inner {
    margin: 0% auto !important;
  }

  .btn-block {
    /* font-size: 1em !important; */
    height: 3.5 !important;
    margin-top: 3.5em !important;
  }
}
</style>
