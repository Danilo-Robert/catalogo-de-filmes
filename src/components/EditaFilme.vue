<template>
  <v-dialog v-model="dialogInterno" max-width="700">
    <v-card>
      <v-card-title>Editar filme</v-card-title>

      <v-card-text>
        <v-form ref="formRef">
          <v-text-field
            v-model="filmeEditado.titulo"
            label="Título"
            :rules="[regras.tituloObrigatorio, regras.tituloMinimo]"
          />

          <v-text-field
            v-model="filmeEditado.generos"
            label="Gêneros"
            :rules="[regras.generoObrigatorio]"
          />

          <v-text-field
            v-model="filmeEditado.nota"
            label="Nota"
            placeholder="Ex: 4.5"
            inputmode="decimal"
            :rules="[regras.notaObrigatoria, regras.notaValida]"
          />

          <v-text-field
            v-model="filmeEditado.imagem"
            label="URL da imagem"
            :rules="[regras.imagemObrigatoria, regras.urlValida]"
          />

          <v-textarea
            v-model="filmeEditado.sinopse"
            label="Sinopse"
            :rules="[regras.sinopseObrigatoria, regras.sinopseMinima]"
          />
        </v-form>
      </v-card-text>

      <v-card-actions>
        <v-spacer></v-spacer>

        <v-btn color="red-darken-1" variant="outlined" @click="fecharModal"
          >Cancelar</v-btn
        >
        <v-btn color="amber-darken-2" variant="elevated" @click="salvarEdicao"
          >Salvar</v-btn
        >
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script setup lang="ts">
import { ref, watch, computed } from "vue";

const props = defineProps({
  dialog: Boolean,
  filme: Object,
});

const emit = defineEmits(["fechar", "salvar"]);

const formRef = ref();

const filmeEditado = ref({
  id: 0,
  titulo: "",
  generos: "",
  nota: "",
  imagem: "",
  sinopse: "",
  favorito: false,
  status: false,
  sinopseAberta: false,
});

const dialogInterno = computed({
  get: () => props.dialog,
  set: (valor) => {
    if (!valor) emit("fechar");
  },
});

watch(
  () => props.filme,
  (novoFilme) => {
    if (novoFilme) {
      filmeEditado.value = {
        ...novoFilme,
        nota: String(novoFilme.nota),
      };
    }
  },
  { immediate: true }
);

const formatarGeneros = (valor: string) => {
  return valor
    .replace(/[.;|/\\-]+/g, " ")
    .replace(/\s+/g, " ")
    .trim()
    .split(" ")
    .filter(Boolean)
    .map(
      (genero) => genero.charAt(0).toUpperCase() + genero.slice(1).toLowerCase()
    )
    .join(", ");
};

const formatarNota = (valor: string) => {
  return valor.replace(",", ".").trim();
};

const regras = {
  tituloObrigatorio: (valor: string) =>
    !!valor?.trim() || "O título é obrigatório",

  tituloMinimo: (valor: string) =>
    valor?.trim().length >= 4 || "O título deve ter no mínimo 4 caracteres",

  generoObrigatorio: (valor: string) =>
    !!valor?.trim() || "O gênero é obrigatório",

  notaObrigatoria: (valor: string) => !!valor?.trim() || "A nota é obrigatória",

  notaValida: (valor: string) => {
    const notaFormatada = formatarNota(valor);

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

const fecharModal = () => {
  emit("fechar");
};

async function salvarEdicao() {
  const { valid } = await formRef.value.validate();

  if (!valid) return;

  emit("salvar", {
    ...filmeEditado.value,
    titulo: filmeEditado.value.titulo.trim(),
    generos: formatarGeneros(filmeEditado.value.generos),
    nota: Number(formatarNota(filmeEditado.value.nota)),
    imagem: filmeEditado.value.imagem.trim(),
    sinopse: filmeEditado.value.sinopse.trim(),
  });

  fecharModal();
}
</script>