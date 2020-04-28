import firebase from "firebase";
export default {
  actions: {
    // eslint-disable-next-line no-unused-vars
    async login({ dispatch, commit }, { email, password }) {
      // eslint-disable-next-line no-useless-catch
      try {
        await firebase.auth().signInWithEmailAndPassword(email, password);
        // eslint-disable-next-line no-empty
      } catch (e) {
        commit("setError", e);
        throw e;
      }
    },
    // eslint-disable-next-line no-unused-vars
    async register({ dispatch, commit }, { email, password, name }) {
      // eslint-disable-next-line no-useless-catch
      try {
        await firebase.auth().createUserWithEmailAndPassword(email, password);
        const uid = await dispatch("getuid");
        await firebase
          .database()
          .ref(`/users/${uid}/info`)
          .set({
            bill: 100000,
            name
          });
        // eslint-disable-next-line no-empty
      } catch (e) {
        commit("setError", e);
        throw e;
      }
    },
    getuid() {
      const user = firebase.auth().currentUser;
      return user ? user.uid : null;
    },
    async logout({ commit }) {
      await firebase.auth().signOut();
      await commit("clearInfo");
    }
  }
};
