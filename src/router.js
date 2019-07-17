import Vue from 'vue'
import VueResource from 'vue-resource'
import VueRouter from 'vue-router'
import VueSocketio from 'vue-socket.io'

import ContactView from './views/ContactView'
import LegalView from './views/LegalView'
import LogoutView from './views/LogoutView'
import LoginView from './views/LoginView'
import SignupView from './views/SignupView'
import ResetPasswordView from './views/ResetPasswordView'
import SetPasswordView from './views/SetPasswordView'
import OnboardingView from './views/OnboardingView'
import DashboardView from './views/DashboardView'
import SessionView from './views/SessionView'
import ActionView from './views/ActionView'
import ScheduleView from './views/ScheduleView'
import ResourcesView from './views/ResourcesView'
import FeedbackView from './views/FeedbackView'
import TrainingView from './views/TrainingView'
import QuizView from './views/QuizView'
import ReviewView from './views/ReviewView'
import ProfileView from './views/ProfileView'
import CalendarView from './views/CalendarView'
import SubmitQuestionView from './views/SubmitQuestionView'
import InboxView from './views/InboxView'
import SendAnswerView from './views/SendAnswerView'

import AuthService from './services/AuthService'
import OnboardingService from './services/OnboardingService'

Vue.use(VueResource)
Vue.use(VueRouter)
Vue.use(VueSocketio, process.env.SOCKET_ADDRESS)

Vue.http.options.credentials = true

const routes = [
  {
    path: '/',
    redirect: () => {
      if (AuthService.user.authenticated) {
        return '/dashboard'
      }
      return '/login'
    }
  },
  { path: '/contact', name: 'ContactView', component: ContactView },
  { path: '/legal', name: 'LegalView', component: LegalView },
  { path: '/login', name: 'LoginView', component: LoginView, meta: { hideSidebar: true } },
  { path: '/logout', name: 'LogoutView', component: LogoutView, meta: { hideSidebar: true } },
  { path: '/signup', name: 'SignupView', component: SignupView, meta: { hideSidebar: true } },
  { path: '/resetpassword', name: 'ResetPasswordView', component: ResetPasswordView, meta: { hideSidebar: true } },
  { path: '/setpassword/:token', name: 'SetPasswordView', component: SetPasswordView, meta: { hideSidebar: true } },
  { path: '/dashboard', name: 'DashboardView', component: DashboardView, meta: { protected: true } },
  {
    path: '/session/math/:subTopic/:sessionId?',
    name: 'SessionView-math',
    component: SessionView,
    meta: { protected: true }
  },
  {
    path: '/session/college/:subTopic/:sessionId?',
    name: 'SessionView-college',
    component: SessionView,
    meta: { protected: true }
  },
  { path: '/schedule', name: 'ScheduleView', component: ScheduleView, meta: { protected: true } },
  {
    path: '/resources',
    name: 'ResourcesView',
    component: ResourcesView,
    meta: { protected: true, bypassOnboarding: true }
  },
  {
    path: '/edu',
    component: () => {
      window.location.href = '/edu'
    }
  },
  {
    path: '/feedback/:sessionId/:userType/:studentId/:volunteerId',
    name: 'FeedbackView',
    component: FeedbackView,
    meta: { protected: true }
  },
  {
    path: '/action/:action/:data?',
    name: 'ActionView',
    component: ActionView,
    meta: { bypassOnboarding: true }
  },
  {
    path: '/onboarding/:step?',
    name: 'OnboardingView',
    component: OnboardingView,
    meta: { protected: true }
  },
  { path: '/training', name: 'TrainingView', component: TrainingView, meta: { protected: true } },
  {
    path: '/training/:category/quiz',
    name: 'QuizView',
    component: QuizView,
    meta: { protected: true }
  },
  {
    path: '/training/:category/review',
    name: 'ReviewView',
    component: ReviewView,
    meta: { protected: true }
  },
  { path: '/profile', name: 'ProfileView', component: ProfileView, meta: { protected: true } },
  { path: '/calendar', name: 'CalendarView', component: CalendarView },
  {
    path: '/submit-question',
    name: 'SubmitQuestionView',
    component: SubmitQuestionView,
    meta: { protected: true }
  },
  { path: '/inbox', name: 'InboxView', component: InboxView, meta: { protected: true } },
  { path: '/send-answer', name: 'SendAnswerView', component: SendAnswerView, meta: { protected: true } }
]

/**
 * @todo Consider refactoring this file
 */
const router = new VueRouter({
  routes,
  linkActiveClass: 'active',
  mode: 'history'
})

export default router

// Router middleware to check authentication for protect routes
router.beforeEach((to, from, next) => {
  if (to.matched.some(route => route.meta.protected)) {
    if (!AuthService.user.authenticated) {
      console.log('Protected route requires login')
      next({
        path: '/login',
        query: {
          redirect: to.fullPath
        }
      })
    } else if (!OnboardingService.isOnboarded()) {
      console.log('User requires onboarding')
      const route = OnboardingService.getOnboardingRoute()
      if (
        to.path.indexOf(route) !== -1 ||
        to.matched.some(route => route.meta.bypassOnboarding)
      ) {
        next()
      } else {
        next({
          path: route,
          query: {
            redirect: to.fullPath
          }
        })
      }
    } else {
      next()
    }
  } else {
    next()
  }
})

// If endpoint returns 401, redirect to login (except for requests to get user's
// session)
Vue.http.interceptors.push((request, next) => {
  next(response => {
    if (
      response.status === 401 &&
      !(request.url.indexOf('/api/user') !== -1 && request.method === 'GET')
    ) {
      AuthService.removeUser()
      router.push('/login?401=true')
    }
  })
})
