import Cookies from 'js-cookie'

const app = {
  state: {
    language: Cookies.get('language') || 'zh',
    containHeight: null,
    dialogHeight: null
  },
  mutations: {
    SET_LANGUAGE: (state, language) => {
      language = language || 'zh'
      state.language = language
      Cookies.set('language', language)
    },
    SET_CONTAIN_HEIGHT: (state, height) => {
      state.containHeight = height
    },
    SET_DIALOG_HEIGHT: (state, height) => {
      state.dialogHeight = height
    }
  },
  actions: {
    setLanguage({ commit }, language) {
      commit('SET_LANGUAGE', language)
    },
    setContainHeight({ commit }, { height, dialogHeight }) {
      commit('SET_CONTAIN_HEIGHT', height)
      commit('SET_DIALOG_HEIGHT', dialogHeight)
    }
  }
}

export default app
