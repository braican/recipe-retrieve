import { createRouter, createWebHistory } from 'vue-router';
import store from '../store';
import Home from '../views/Home.vue';

const routes = [
  {
    path: '/',
    name: 'Home',
    component: Home,
  },
  {
    path: '/about',
    name: 'About',
    meta: {
      authRequired: true,
    },
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () => import(/* webpackChunkName: "about" */ '../views/About.vue'),
  },
];

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes,
});

router.beforeEach((to, from, next) => {
  const authRequired = to.matched.some(route => route.meta.authRequired);
  // If the route doesnt have a `meta.authRequired` property go on ahead!
  if (!authRequired) {
    return next();
  }
  // If we go this far then it must have the `meta.authRequired`. But is there is a user logged in? If so, then go right on ahead!
  if (store.getters['auth/loggedIn']) {
    return next();
  }
  // The page requested is both secured and there is no logged in user detected. Sorry mate. No entry!
  console.warn('Page restricted, you need to login');
  next({ name: 'home', query: { redirectFrom: to.fullPath } });
});

export default router;
