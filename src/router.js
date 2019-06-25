import Vue from 'vue';
import Router from 'vue-router';

import firebase from 'firebase/app';
import 'firebase/auth';

import Home from '@/views/Home';
import Recipes from '@/views/Recipes';

Vue.use(Router);

const router = new Router({
  mode: 'history',
  base: process.env.BASE_URL,
  routes: [
    {
      path: '*',
      redirect: '/',
    },
    {
      path: '/',
      name: 'Home',
      component: Home,
      meta: {
        requiresAuth: false,
      },
    },
    {
      path: '/recipes',
      name: 'Recipes',
      component: Recipes,
      meta: {
        requiresAuth: true,
      },
    },
  ],
});

router.beforeEach((to, from, next) => {
  const currentUser = firebase.auth().currentUser;
  const requiresAuth = to.matched.some(record => record.meta.requiresAuth);

  if (requiresAuth && !currentUser) {
    next('/');
  } else if (currentUser && !requiresAuth) {
    next('/recipes');
  } else {
    next();
  }
});

export default router;
