<template>
  <form class="form-signup">
    <div>
      <div v-if="step === 'step-1'">
        <div class="step-1-text" colspan="2">
          <b>Step 1 of 2: Choose your log-in details </b>
        </div>
        <label for="inputEmail">What's your email?</label>
        <input
          id="inputEmail"
          v-model="credentials.email"
          type="email"
          class="form-control"
          required
          autofocus
        />
        <div class="description">
          We will only use your email to contact you about your account. See our
          Privacy Policy for more info.
        </div>
        <label for="inputPassword">Create a password.</label>
        <input
          id="inputPassword"
          v-model="credentials.password"
          type="password"
          class="form-control"
          required
        />
        <p class="password-guidelines">
          Keep your account safe by choosing a password with one number, one
          uppercase letter, and one lowercase letter.
        </p>
        <button
          class="btn btn-lg btn-primary btn-block"
          type="submit"
          @click.prevent="nextPage()"
        >
          CONTINUE
        </button>
        {{ msg }}
      </div>
      <div v-else-if="step === 'step-2'">
        <table class="step-2-table">
          <tr>
            <td class="table-entry" colspan="2">
              <b>Step 2 of 2: Tell us about yourself! </b>
            </td>
          </tr>
          <tr class="question-row">
            <td class="table-entry" colspan="2">What's your name?</td>
          </tr>
          <tr>
            <td style="padding-right: 15px;">
              <input
                v-model="profile.firstName"
                class="form-control"
                required
                autofocus
              />
            </td>

            <td style="padding-left: 15px;">
              <input
                v-model="profile.lastName"
                class="form-control"
                required
                autofocus
              />
            </td>
          </tr>
          <tr>
            <td class="table-entry">
              <div class="description" style="padding-bottom: 0px;">
                First Name
              </div>
            </td>
            <td class="table-entry">
              <div class="description" style="padding-bottom: 0px;">
                Last Name
              </div>
            </td>
          </tr>
          <tr class="question-row">
            <td class="table-entry" colspan="2">
              What high school do you go to?
            </td>
          </tr>
          <tr>
            <td colspan="2">
              <input
                v-model="profile.highSchool"
                class="form-control"
                required
                autofocus
              />
            </td>
          </tr>
          <tr class="question-row">
            <td class="table-entry" colspan="2">How did you hear about us?</td>
          </tr>
          <tr>
            <td colspan="2">
              <select v-model="profile.heardFrom" class="form-control topic">
                <option value="Flyer">Flyer</option>
                <option value="Email">Email</option>
                <option value="Internet search">Internet search</option>
                <option value="Friend">Friend</option>
                <option value="Family member">Family member</option>
                <option value="Teacher">Teacher</option>
                <option value="School">School</option>
                <option value="Social media">Social media</option>
                <option value="Other">Other</option>
              </select>
            </td>
          </tr>
          <tr class="question-row">
            <td class="table-entry" style="height: 50px;" colspan="2">
              Do you get help from any of these organizations?
            </td>
          </tr>
          <tr>
            <td colspan="2">
              <select class="form-control topic" v-model="profile.referred">
                <option value="Big Brothers Big Sisters of NYC"
                  >Big Brothers Big Sisters of NYC</option
                >
                <option value="Breakthrough New York"
                  >Breakthrough New York</option
                >
                <option value="East Harlem Tutorial Program"
                  >East Harlem Tutorial Program</option
                >
                <option value="First Graduate">First Graduate</option>
                <option value="Oasis - A Heaven for Women and Children"
                  >Oasis - A Heaven for Women and Children</option
                >
                <option value="NYC Mission Society"
                  >NYC Mission Society</option
                >
                <option value="None of the above">None of the above</option>
              </select>
            </td>
          </tr>
          <tr>
            <div class="agreement-box">
              <input
                id="userAgreement"
                v-model="credentials.terms"
                type="checkbox"
                required
              />
              <label id="agreement" for="userAgreement" />
              <div class="agreement-label">
                I have read and accept the
                <a href="#/legal" target="_blank">user agreement</a>.
              </div>
            </div>
          </tr>
        </table>

        <button
          class="btn btn-lg btn-primary btn-block"
          type="submit"
          @click.prevent="submit()"
        >
          SIGN UP
        </button>
      </div>
      <div v-else>Unexpected Error</div>
    </div>
  </form>
</template>

<script>
import AuthService from 'src/services/AuthService'
import UserService from '../../services/UserService'

export default {
  data () {
    return {
      msg: '',
      credentials: {
        email: '',
        password: '',
        terms: false
      },
      profile: {
        firstName: '',
        lastName: '',
        highSchool: '',
        heardFrom: '',
        referred: ''
      },
      step: 'step-1'
    }
  },
  methods: {
    nextPage () {
      AuthService.checkRegister(this, {
        email: this.credentials.email,
        password: this.credentials.password
      })
        .then(() => {
          this.step = 'step-2'
        })
        .catch(err => {
          this.msg = err.message
        })
    },
    submit () {
      AuthService.register(this, {
        code: undefined,
        email: this.credentials.email,
        password: this.credentials.password,
        terms: this.credentials.terms
      })
        .then(() => {
          let user = UserService.getUser()
          user.firstname = this.profile.firstName
          user.lastname = this.profile.lastName
          user.highschool = this.profile.highSchool
          user.heardFrom = this.profile.heardFrom
          user.referred = this.profile.referred
          UserService.setProfile(this, user, '/')
        })
        .catch(err => {
          console.log(err)
          this.msg = err.message
        })
    }
  }
}
</script>

<style scoped>
.header {
  display: flex;
  justify-content: space-between;
  margin-bottom: 25px;
  margin-top: 25px;
}

.step-1-text {
  text-align: left;
  padding-bottom: 25px;
}
.login-link {
  color: #73737a;
  font-weight: 600;
}
.registration-header {
  color: #16d2aa;
  font-weight: 600;
}
.description {
  font-size: 12px;
  text-align: left;
  color: #73737a;
}

#inputEmail {
  margin-bottom: 6px;
}

.form-signup {
  height: 100%;
  display: flex;
  flex-direction: column;
  max-width: 500px;

  margin: auto;
}
.form-control {
  border: none;
  box-shadow: none;
  border-radius: 0;
}

.form-signup .form-control:focus {
  z-index: 2;
}

label {
  display: block;
  text-align: left;
  font-size: 16px;
  font-weight: 400;
  color: #343440;
}
.form-control {
  border-bottom: 3px solid #16d2aa;
  margin-bottom: 50px;
}
.form-control:last-of-type {
  margin-bottom: 0;
}

.password-guidelines {
  font-size: 12px;
  font-weight: 300;
  text-align: left;
  color: #73737a;
  margin: 10px auto;
}

.form-control:focus {
  border-bottom: 3px solid black;
  box-shadow: none;
}

#userAgreement {
  margin-right: 12px;
  border: 3px solid #000;
  display: inline-block;
}

#agreement {
  display: inline-block;
  margin-bottom: 0;
}

input[type='checkbox'] {
  visibility: hidden;
  position: absolute;
  top: -9999px;
}

.agreement-box {
  margin: 15px 0 10px 0;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
}

.agreement-box label {
  cursor: pointer;
  margin-right: 12px;
  width: 18px;
  height: 18px;
  background: #fff;
  border: 2px solid #343440;
  border-radius: 2px;
}

.agreement-box label:after {
  opacity: 0;
  content: '';
  position: absolute;
  margin: 4px 0 0 3px;
  width: 8px;
  height: 5px;
  background: transparent;
  border: 3px solid #343440;
  border-top: none;
  border-right: none;
  transform: rotate(-45deg);
}

.agreement-box input[type='checkbox']:checked + label:after {
  opacity: 1;
}

.agreement-label {
  font-size: 12px;
  color: #343440;
  position: absolute;
  margin-left: 35px;
}

.agreement-label a {
  color: #16d2aa;
}

button[type='submit'] {
  margin-top: 5px;
  background-color: #f6f6f6;
  border: none;
  font-weight: 600;
  color: #16d2aa;
  height: 40px;
  border-radius: 20px;
  font-size: 12px;
  margin-bottom: 10px;
}

button[type='submit']:hover,
button[type='submit']:active {
  color: white;
  background-color: #16d2aa;
}

.successMessage {
  text-align: left;
  margin-top: 50px;
  padding-bottom: 20px;
  border-bottom: 3px solid black;
}

.step-2-table {
  width: 100%;
}

.table-entry {
  text-align: left;
}

.question-row {
  height: 28px;
  vertical-align: bottom;
}


@media screen and (max-width: 488px) {
  .btn-block {
    margin: 2.5em 0em 0em !important;
  }


}
</style>
