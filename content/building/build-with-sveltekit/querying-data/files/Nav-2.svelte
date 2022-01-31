<script lang="js">
  import Cookies from 'js-cookie';
  import { userSession } from '../store.js';

  let user;
  userSession.subscribe(val => {
    user = val;
    const cookies = Cookies.get('fauna-session');
    if(!val && cookies) {
      user = JSON.parse(cookies);
      userSession.set(user);
    }
  });


  function logout() {
    Cookies.remove('fauna-session');
    alert('User Logoed Out');
    userSession.update(() => null);
    window.location.reload();
  }
</script>

<nav class="uk-navbar-container wrap" >
  <div class="uk-navbar-left">
    <ul class="uk-navbar-nav">
      <li class="uk-active"><a href='/'>Fauna E-Com</a></li>
    </ul>
  </div>
  <div class="uk-navbar-right">
    <ul class="uk-navbar-nav">
      {#if user}
        <li >
          <a href='/store/new' class="uk-button uk-button-primary add-btn">
            Add Store
          </a>
        </li>
        <li >
          <!-- svelte-ignore a11y-missing-attribute -->
          <a on:click={logout} class="uk-button uk-button-danger add-btn">
            Logout
          </a>
        </li>
      {:else}
        <li >
          <a href='/login' class="uk-button uk-button-primary add-btn">
            Login
          </a>
        </li>
        <li >
          <a href='/signup' class="uk-button uk-button-danger add-btn">
            Signup
          </a>
        </li>
      {/if}
    </ul>
  </div>
</nav>

<style>
.wrap {
  display: flex;
}
.add-btn {
  color: azure;
}
</style>
