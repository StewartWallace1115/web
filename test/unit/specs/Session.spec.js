var expect = require('chai').expect;
import Vue from 'vue'
import Chat from 'src/components/Session/Chat.vue'

describe('Chat.vue', () => {
  it('chat warning set to true', () => {
     const vm = new Vue(Chat).$mount()
		vm.chatWarningIsShown = false; // Reset property
		vm.showModerationWarning();
    expect(vm.chatWarningIsShown).to.be.true;
  })
})
