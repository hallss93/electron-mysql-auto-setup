<template>
  <div id="wrapper">
        <ul id="files">
        </ul>
  </div>
</template>

<script>
  export default {
    name: 'home',
    created(){
      setTimeout(() => {
        var file = "mini_server_11.zip"
        const a = document.createElement('a');
        a.dataset.uniqueFilename = file;
        a.href = `fixtures/${file}`;
        a.innerText = "Iniciar Download e Conexão ao banco";
        const li = document.createElement('li');
        li.append(a);
        document.querySelector('#files').append(li);
      }, 1000);
    }
  }
</script>
