<template>
  <v-app id="inspire">
    <v-navigation-drawer v-model="drawer"> </v-navigation-drawer>

    <v-app-bar>
      <v-app-bar-nav-icon @click="drawer = !drawer"></v-app-bar-nav-icon>
      <v-app-bar-title v-if="!mostrarBusca">Catálogo de Filmes</v-app-bar-title>
      <v-text-field
        v-if="mostrarBusca"
        v-model="busca"
        placeholder="Buscar filme..."
        variant="solo"
        density="comfortable"
        hide-details
        autofocus
        class="flex-grow-1 mx-4"
      />

      <v-spacer v-if="!mostrarBusca"></v-spacer>
      <v-btn icon @click="alternarTema">
        <v-icon>
          {{
            temaAtual === "light"
              ? "mdi-weather-night"
              : "mdi-white-balance-sunny"
          }}
        </v-icon>
      </v-btn>
      <v-btn icon @click="toggleBusca">
        <v-icon>{{ mostrarBusca ? "mdi-close" : "mdi-magnify" }}</v-icon>
      </v-btn>
    </v-app-bar>

    <v-main>
      <catalogo :busca="busca"></catalogo>
    </v-main>
  </v-app>
</template>

<script setup>
import { ref, computed } from "vue";
import Catalogo from "./components/Catalogo.vue";
import { useTheme } from "vuetify";

const mostrarBusca = ref(false);
const busca = ref("");

const toggleBusca = () => {
  mostrarBusca.value = !mostrarBusca.value;

  if (!mostrarBusca.value) {
    busca.value = "";
  }
};

const drawer = ref(null);

const theme = useTheme()
const temaAtual = computed(() => theme.global.name.value)

const alternarTema = () => {
  const novoTema = temaAtual.value === "light" ? "dark" : "light"
  theme.global.name.value = novoTema
  localStorage.setItem("temaApp", novoTema)
}
</script>

<script>
export default {
  data: () => ({ drawer: null }),
};


</script>