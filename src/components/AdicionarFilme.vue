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
          :rules="[regras.tituloObrigatorio, regras.tituloMinimo]"
          class="mb-3"></v-text-field>

          <v-text-field
          v-model="novoFilme.generos"
          label="Gêneros"
          variant="outlined"
          :rules="[regras.generoObrigatorio]"
          class="mb-3"></v-text-field>

          <v-text-field
          v-model="novoFilme.nota"
          label="Nota"
          variant="outlined"
          :rules="[regras.notaObrigatoria, regras.notaValida]"
          class="mb-3"></v-text-field>

          <v-text-field
          v-model="novoFilme.imagem"
          label="URL da imagem"
          variant="outlined"
          :rules="[regras.imagemObrigatoria, regras.urlValida]"
          class="mb-3"></v-text-field>

          <v-textarea
            v-model="novoFilme.sinopse"
            label="Sinopse"
            variant="outlined"
            :rules="[regras.sinopseObrigatoria, regras.sinopseMinima]"
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
  nota: "",
  imagem: "",
  sinopse: "",
});

const formatarGeneros = (valor: string) => {
  return valor
    .replace(/[.,;|/\\-]+/g, " ")
    .replace(/\s+/g, " ")
    .trim()
    .split(" ")
    .filter(Boolean)
    .map((genero) => genero.charAt(0).toUpperCase() + genero.slice(1).toLowerCase())
    .join(", ");
};

const formataNota = (valor: string) => {
  return valor.replace(",", ".").trim();
};

const regras = {
  tituloObrigatorio: (valor: string) => !!valor?.trim() || "Este campo é obrigatório",

  tituloMinimo: (valor: string) =>
    valor?.trim().length >= 4 || "O título deve ter no mínimo 4 caracteres",

  generoObrigatorio: (valor: string) =>
    !!valor?.trim() || "O gênero é obrigatório",

  notaObrigatoria: (valor: string) =>
    !!valor?.trim() || "A nota é obrigatória",

  notaValida: (valor: string) => {
    const notaFormatada = formataNota(valor);

    if (!notaFormatada) return "A nota é obrigatória";

    const regex = /^(?:[0-4](?:\.\d)?|5(?:\.0)?)$/;

    if (!regex.test(notaFormatada)) {
      return 'A nota deve estar no formato "4.5" e no máximo 5.0';
    }

    const numero = Number(notaFormatada);

    if (isNaN(numero)) return "Digite uma nota válida";
    if (numero > 5) return "A nota não pode ser maior que 5.0";

    return true;
  },

  imagemObrigatoria: (valor: string) =>
    !!valor?.trim() || "A URL da imagem é obrigatória",

  urlValida: (valor: string) => {
    if (!valor?.trim()) return "A URL da imagem é obrigatória";

    try {
      new URL(valor);
      return true;
    } catch {
      return "Digite uma URL válida";
    }
  },

  sinopseObrigatoria: (valor: string) =>
    !!valor?.trim() || "A sinopse é obrigatória",

  sinopseMinima: (valor: string) =>
    valor?.trim().length >= 15 || "A sinopse deve ter no mínimo 15 caracteres",
};

const abrirModal = () => {
  dialog.value = true;
};

const fecharModal = () => {
  dialog.value = false;

  novoFilme.value = {
    titulo: "",
    generos: "",
    nota: "",
    imagem: "",
    sinopse: "",
  };
}

async function salvarFilme() {
  const { valid } = await formRef.value.validate();

  if(!valid) return;

  const generosFormatados = formatarGeneros(novoFilme.value.generos);
  const notaFormatada = formataNota(novoFilme.value.nota);

  emit("adicionar-filme", {
    ...novoFilme.value,
    titulo: novoFilme.value.titulo.trim(),
    generos: generosFormatados,
    nota: Number(notaFormatada),
    imagem: novoFilme.value.imagem.trim(),
    sinopse: novoFilme.value.sinopse.trim(),
  });

  fecharModal();
}
</script>