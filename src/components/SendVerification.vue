<template>
  <div class="verify-inner">
    <p>
      Your email has not been verified. Check your email for a link to confirm
      your account, or click below to send another verification email:
    </p>
    <a class="btn btn-default" href="#" role="button" @click="sendVerification"
      >Send verification</a
    >

    {{ msg }}
  </div>
</template>

<script>
import OnboardingService from 'src/services/OnboardingService'

export default {
  data () {
    return {
      msg: ''
    }
  },
  methods: {
    sendVerification () {
      OnboardingService.sendVerification(this, '/')
    }
  }
}
</script>

<style scoped>
@media screen and (max-width: 488px) {
  .verify-inner {
    padding: 6em 2em 1em !important;
  }
}
</style>
