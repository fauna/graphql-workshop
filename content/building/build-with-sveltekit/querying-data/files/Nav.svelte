// src/lib/Nav.svelte
<script lang="js">
  import Cookies from 'js-cookie';

  function logout() {
    Cookies.remove('fauna-session');
    alert('User Logoed Out');
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
