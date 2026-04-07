<template>
  <div class="d-flex justify-end mb-4">
    <v-btn 
    color="amber-darken-2"
    variant="outlined" 
    @click="abrirModal">
      Adicionar Filme
    </v-btn>
  </div>

  <v-dialog v-model="dialog" max-width="600">
    <v-card>
      <v-card-title>Adicionar Filme</v-card-title>

      <v-card-text>
        <v-form ref="formRef">
          <v-text-field
          v-model="novoFilme.titulo"
          label="Título"
          variant="outlined"
          :rules="[regras.obrigatorio]"
          class="mb-3"></v-text-field>

          <v-text-field
          v-model="novoFilme.generos"
          label="Gêneros"
          variant="outlined"
          :rules="[regras.obrigatorio]"
          class="mb-3"></v-text-field>

          <v-text-field
          v-model="novoFilme.nota"
          label="Nota"
          variant="outlined"
          :rules="[regras.obrigatorio]"
          class="mb-3"></v-text-field>

          <v-text-field
          v-model="novoFilme.imagem"
          label="URL da imagem"
          variant="outlined"
          :rules="[regras.obrigatorio]"
          class="mb-3"></v-text-field>

          <v-textarea
            v-model="novoFilme.sinopse"
            label="Sinopse"
            variant="outlined"
            :rules="[regras.obrigatorio]"
            rows="4"></v-textarea>

        </v-form>
      </v-card-text>

      <v-card-actions>
        <v-spacer></v-spacer>

        <v-btn 
        color="red-darken-1"
        variant="outline"  
        @click="fecharModal">
          Cancelar
        </v-btn>

        <v-btn 
        color="amber-darken-2"
        variant="elevated"  
        @click="salvarFilme">
          Salvar
        </v-btn>

      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script setup lang="ts">
import { ref } from 'vue';

const emit = defineEmits(["adicionar-filme"]);

const dialog = ref(false);
const formRef = ref(null);

const novoFilme = ref({
  titulo: "",
  generos: "",
  nota: null,
  imagem: "",
  sinopse: "",
});

const regras = {
  obrigatorio: (valor) => !!valor || "Este campo é obrigatório",
};

const abrirModal = () => {
  dialog.value = true;
};

const fecharModal = () => {
  dialog.value = false;

  novoFilme.value = {
    titulo: "",
    generos: "",
    nota: null,
    imagem: "",
    sinopse: "",
  };
}

async function salvarFilme() {
  const { valid } = await formRef.value.validate();

  if(!valid) return;

  emit("adicionar-filme", {
    ...novoFilme.value,
    nota: Number(novoFilme.value.nota)
  });

  fecharModal();
}
</script>