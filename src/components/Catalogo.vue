<template>
  <v-container>
    <AdicionarFilme @adicionar-filme="adicionarFilme" />

    <v-row align="stretch">
      <v-col
        v-for="filme in filmesFiltrados"
        :key="filme.id"
        cols="12"
        sm="6"
        md="4"
        class="d-flex"
      >
        <v-card class="d-flex flex-column" style="width: 100%">
          <v-img
            height="285px"
            :src="filme.imagem"
            cover
            @click="abrirDetalhes(filme)"
          />
          <v-icon
            :color="filme.favorito ? 'red-darken-1' : 'grey-lighten-1'"
            class="position-absolute top-0 right-0 ma-2"
            @click="filme.favorito = !filme.favorito"
            >{{ filme.favorito ? "mdi-heart" : "mdi-heart-outline" }}</v-icon
          >
          <v-card-title class="d-flex align-center justify-space-between">
            <span class="text-wrap" :title="filme.titulo">{{
              filme.titulo
            }}</span>
            <v-icon
              :color="filme.status ? 'amber-darken-2' : 'grey-lighten-1'"
              @click="filme.status = !filme.status"
            >
              {{
                filme.status
                  ? "mdi-star-box-multiple"
                  : "mdi-star-box-multiple-outline"
              }}
            </v-icon>
          </v-card-title>

          <v-card-subtitle>
            {{ filme.generos }}
          </v-card-subtitle>

          <v-card-actions>
            <v-btn
              color="amber-darken-2"
              @click="filme.sinopseAberta = !filme.sinopseAberta"
              >Descrição</v-btn
            >

            <v-spacer></v-spacer>

            <div class="d-flex align-center">
              <v-icon color="amber-darken-2" class="mr-1"> mdi-star </v-icon>
              <span>{{ filme.nota?.toFixed(1) || "0.0" }}/5</span>
            </div>
          </v-card-actions>
          <v-expand-transition>
            <div v-show="filme.sinopseAberta">
              <v-divider></v-divider>

              <v-card-text>
                {{ filme.sinopse }}
              </v-card-text>
            </div>
          </v-expand-transition>

          <v-card-actions>
            <v-btn
              block
              color="amber-darken-2"
              variant="outlined"
              @click="abrirDetalhes(filme)"
            >
              Detalhes</v-btn
            >
          </v-card-actions>
        </v-card>
      </v-col>
    </v-row>

    <v-dialog v-model="dialog" max-width="800">
      <v-card
        v-if="filmeSelecionado"
        style="max-height: 90vh; overflow-y: auto"
      >
        <v-card-text class="d-flex justify-center">
          <v-img :src="filmeSelecionado.imagem" max-height="350" contain>
          </v-img>
        </v-card-text>

        <template v-slot:append>
          <v-menu>
            <template v-slot:activator="{ props }">
              <v-btn
                color="grey-lighten"
                icon="mdi-cog"
                variant="text"
                v-bind="props"
              ></v-btn>
            </template>
            <v-list>
              <v-list-item @click="abrirEdicao">
                <v-list-item-title>Editar</v-list-item-title>
              </v-list-item>

              <v-list-item>
                <v-list-item-title>Deletar</v-list-item-title>
              </v-list-item>
            </v-list>
          </v-menu>
        </template>

        <v-card-title>
          {{ filmeSelecionado.titulo }}
        </v-card-title>

        <v-card-subtitle>
          {{ filmeSelecionado.generos }}
        </v-card-subtitle>

        <v-card-text>
          <div class="d-flex align-center mb-4">
            <v-icon
              icon="mdi-star"
              color="amber-darken-2"
              class="mr-1"
            ></v-icon>
            <span>{{ filmeSelecionado.nota.toFixed(1) }}/5</span>
          </div>

          <div>
            {{ filmeSelecionado.sinopse }}
          </div>
        </v-card-text>

        <v-card-actions>
          <v-spacer></v-spacer>

          <v-btn
            color="amber-darken-2"
            variant="outlined"
            @click="dialog = false"
            >Fechar</v-btn
          >
        </v-card-actions>
      </v-card>
    </v-dialog>
    <EditaFilme
      :dialog="dialogEditar"
      :filme="filmeEditando"
      @fechar="dialogEditar = false"
      @salvar="salvarEdicao"
    />
  </v-container>
</template>

<script setup lang="ts">
import { ref, computed } from "vue";
import AdicionarFilme from "./AdicionarFilme.vue";
import EditaFilme from "./EditaFilme.vue";

const props = defineProps({
  busca: String,
});

const filmes = ref([
  {
    id: 1,
    titulo: "Velozes e Furiosos",
    generos: "Ação, Aventura, Corrida",
    favorito: false,
    nota: 4.8,
    status: false,
    imagem:
      "https://img.elo7.com.br/product/zoom/268DCC4/big-poster-velozes-e-furiosos-lo06-tamanho-90x60-cm-velozes-e-furiosos.jpg",
    sinopse:
      "Dominic Toretto (Vin Diesel) é o líder de uma gangue de corridas de ruas em Los Angeles que está sendo investigado pela polícia por roubo de equipamentos eletrônicos. Para investigá-lo é enviado Brian O'Conner (Paul Walker), que se infiltra na gangue na intenção de descobrir se Toretto é realmente o autor dos crimes ou se há alguém mais por trás deles.",
    sinopseAberta: false,
  },
  {
    id: 2,
    titulo: "+ Velozes + Furiosos",
    generos: "Ação, Aventura, Crime",
    favorito: false,
    nota: 4.9,
    status: false,
    imagem:
      "https://br.web.img3.acsta.net/c_310_420/medias/nmedia/18/90/03/20/20077808.jpg",
    sinopse:
      "Após deixar a polícia, Brian O'Conner (Paul Walker) é forçado a participar de uma nova missão: se infiltrar no crime organizado de Miami de forma a investigar sobre o transporte de dinheiro sujo para Carter Verone (Cole Hauser), o chefe do tráfico local. Para tanto ele recebe a ajuda de seu ex-colega Roman Pearce (Tyrese) e da agente secreta Monica Clemente (Eva Mendes).",
    sinopseAberta: false,
  },
  {
    id: 3,
    titulo: "Velozes & Furiosos 4",
    generos: "Ação, Corrida, Crime",
    favorito: false,
    nota: 4.0,
    status: false,
    imagem:
      "https://br.web.img3.acsta.net/c_310_420/pictures/210/445/21044501_2013092621313492.jpg",
    sinopse:
      'Depois de ser visto rumo ao México no filme que deu origem a série, Dominic "Dom" Toretto (Vin Diesel) reaparece na República Dominicana praticando seus golpes ao lado de sua namorada Letty (Michelle Rodriguez) e sua gangue. Com o FBI na sua cola, Dom decide fugir para não comprometer seus comparsas. Contudo, um assassinato cometido por um traficante de drogas acende nele uma sede de vingança que o faz cruzar novamente com o agente Brian O\'Conner (Paul Walker) numa perigosa missão.',
    sinopseAberta: false,
  },
  {
    id: 4,
    titulo: "Velozes & Furiosos 5: Operação Rio",
    generos: "Ação, Aventura, Crime",
    favorito: false,
    nota: 4.5,
    status: false,
    imagem:
      "https://br.web.img3.acsta.net/c_300_300/medias/nmedia/18/87/34/17/19921609.jpg",
    sinopse:
      "Em Velozes & Furiosos 5: Operação Rio, Dominic Toretto (Vin Diesel) foi resgatado da prisão por sua irmã Mia (Jordana Brewster) e Brian O'Conner (Paul Walker), que realizam um ousado resgate sobre rodas. Logo em seguida, ele desaparece. Brian e Mia vão até o Rio de Janeiro, onde encontram Vince (Matt Schulze). Ele propõe ao casal o roubo de carros que estão sendo levados em um trem, algo que, segundo ele, será uma operação simples que renderá um bom lucro. Durante a operação, Dominic reaparece e diz à irmã que os planos mudaram. Ela então leva um dos carros a um esconderijo em plena favela carioca, deixando Dominic e Brian enfrentando policiais e bandidos. Ao desmontar o carro, o trio descobre que ele contém um chip com todas as operações ilegais de Hernan Reis (Joaquim de Almeida), incluindo onde guarda o dinheiro arrecadado. É o suficiente para que eles elaborem um plano para roubar a fortuna de Reis, contando com a ajuda de vários amigos.",
    sinopseAberta: false,
  },
  {
    id: 5,
    titulo: "Velozes & Furiosos 6",
    generos: "Ação, Aventura, Loucura",
    favorito: false,
    nota: 4.2,
    status: false,
    imagem:
      "https://br.web.img2.acsta.net/c_310_420/medias/nmedia/18/92/81/46/20528636.jpg",
    sinopse:
      "Em Velozes e Furiosos 6, os heróis se espalham pelo mundo após o golpe de Dom (Vin Diesel) e Brian (Paul Walker) no Rio de Janeiro que deixou o grupo com US$100 milhões. Mas a incapacidade de voltar para casa e viver em um lar tornou suas vidas incompletas. Enquanto isso, Hobbs (Dwayne Johnson) esteve perseguindo uma organização de mercenários sobre rodas, um grupo de homens cruéis divididos em 12 países, cujo mentor (Luke Evans) tem ajuda da destemida Letty (Michelle Rodriguez), a antiga namorada de Dom, que ele acreditava estar morta. A única maneira de parar este grupo de criminosos é superá-los nas ruas, por isso Hobbs pede a Dom para reunir um grupo de elite em Londres. A recompensa? Perdão a todos eles, para poderem voltar para as suas casas e tornarem suas famílias completas novamente.",
    sinopseAberta: false,
  },
  {
    id: 6,
    titulo: "Velozes & Furiosos 7",
    generos: "Ação, Aventura, Tristeza",
    favorito: false,
    nota: 4.6,
    status: false,
    imagem:
      "https://br.web.img3.acsta.net/c_310_420/pictures/15/03/30/21/19/054397.jpg",
    sinopse:
      "Velozes e Furiosos 7 acompanha Dom (Vin Diesel), Brian (Paul Walker), Letty (Michelle Rodriguez) e o resto da equipe após os acontecimentos em Londres. Apesar de terem suas chances de voltar para os Estados Unidos e recomeçarem suas vidas, a tranquilidade do grupo é destruída quando Deckard Shaw (Jason Statham), um assassino profissional, quer vingança pela morte de seu irmão. Agora, a equipe tem que se reunir para impedir este novo vilão. Mas dessa vez, não é só sobre ser veloz. A luta é pela sobrevivência.",
    sinopseAberta: false,
  },
]);

const filmesFiltrados = computed(() => {
  if (!props.busca) {
    return filmes.value;
  }
  return filmes.value.filter((filme) =>
    filme.titulo.toLowerCase().includes(props.busca.toLocaleLowerCase())
  );
});
const dialog = ref(false);
const filmeSelecionado = ref(null);

const abrirDetalhes = (filme) => {
  filmeSelecionado.value = filme;
  dialog.value = true;
};

const adicionarFilme = (novoFilme) => {
  const novoId =
    filmes.value.length > 0
      ? Math.max(...filmes.value.map((filme) => filme.id)) + 1
      : 1;

  filmes.value.push({
    id: novoId,
    ...novoFilme,
    imagem: novoFilme.imagem || "https://placehold.co/300x450",
  });
};

const dialogEditar = ref(false);
const filmeEditando = ref(null);

const abrirEdicao = () => {
  filmeEditando.value = { ...filmeSelecionado.value };
  dialogEditar.value = true;
};

const salvarEdicao = (filmeAtualizado) => {
  const index = filmes.value.findIndex(
    (filme) => filme.id === filmeAtualizado.id
  );

  if (index !== -1) {
    filmes.value[index] = {
      ...filmes.value[index],
      ...filmeAtualizado,
    };
  }

  filmeSelecionado.value = filmes.value[index];
  dialogEditar.value = false;
};
</script>