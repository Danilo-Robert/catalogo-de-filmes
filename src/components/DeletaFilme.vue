<template>
  <v-dialog v-model="dialogInterno" max-width="400">
    <v-card class="pa-2">
      <v-card-title
        class="text-h6 text-center d-flex align-center justify-center"
      >
        <v-icon color="red-darken-1" class="mr-2">mdi-alert</v-icon>
        Confirmar exclusão
      </v-card-title>

      <v-card-text class="text-center py-2">
        Tem certeza que deseja deletar o filme
        <strong>{{ filme?.titulo }}</strong
        >?
      </v-card-text>

      <v-card-actions class="justify-center pt-0">
        <v-spacer></v-spacer>

        <v-btn color="red-darken-1" variant="outlined" @click="fecharModal">
          Cancelar
        </v-btn>

        <v-btn
          color="amber-darken-2"
          variant="elevated"
          @click="confirmarExclusao"
        >
          Deletar
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script setup lang="ts">
import { computed } from "vue";

const props = defineProps({
  dialog: Boolean,
  filme: Object,
});

const emit = defineEmits(["fechar", "confirmar"]);

const dialogInterno = computed({
  get: () => props.dialog,
  set: (valor) => {
    if (!valor) emit("fechar");
  },
});

const fecharModal = () => {
  emit("fechar");
};

const confirmarExclusao = () => {
  emit("confirmar");
};
</script>